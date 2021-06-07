import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import {catchError, map, tap} from 'rxjs/operators';
import {throwError, BehaviorSubject, Observable} from 'rxjs';

import { User } from './user.model';
import {SignupForm} from './signupform.model';
import {MarketService, Supermarket} from '../shared/market.service';
import {environment} from '../../environments/environment';


export interface AuthResponseData {
  idToken: string;
  email: string;
  expiresAt: Date;
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  GUEST = 'GUEST'
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  MOCK_API = 'https://60b3a9594ecdc1001747fac2.mockapi.io/';
  API = environment.API;

  constructor(
    private http: HttpClient,
    private router: Router,
    private marketService: MarketService
  ) {}

  signup(signupForm: SignupForm): Observable<string> {
    return this.http
      .post(
        this.API + 'any-user/register',
        {
          firstName: signupForm.firstName,
          lastName: signupForm.lastName,
          email: signupForm.email,
          password: signupForm.password,
          address: signupForm.address,
          cap: signupForm.cap,
          city: signupForm.city
        },
        {responseType: 'text'}
      )
      .pipe(
        catchError(this.handleError),
        map(resData => {
          return resData;
        })
      );
  }

  signupGuest(signupForm: SignupForm): Observable<string> {
    return this.http
      .post(
        this.API + 'guest/register?token=' + (this.user.value ? this.user.value.token : ''),
        {
          firstName: signupForm.firstName,
          lastName: signupForm.lastName,
          email: signupForm.email,
          password: signupForm.password,
          address: signupForm.address,
          cap: signupForm.cap,
          city: signupForm.city
        },
        {responseType: 'text'}
      )
      .pipe(
        catchError(this.handleError),
        map(resData => {
          return resData;
        })
      );
  }

  login(email: string, password: string, role: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        this.API + 'admin-user/login',
        // this.MOCK_API + 'login',
        {
          email,
          password,
          appUserRole: role
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.idToken,
            resData.expiresAt,
            role
          );
        })
      );
  }

  loginGuestExisting(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        this.API + 'guest/login/existing?token=' + (this.user.value ? this.user.value.token : ''),
        // this.MOCK_API + 'login',
        {
          email,
          password,
          appUserRole: 'USER'
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.idToken,
            resData.expiresAt,
            'USER'
          );
        })
      );
  }

  loginGuest(): Observable<AuthResponseData> {
    return this.http.get<AuthResponseData>(
      this.API + 'guest/login',
      // this.MOCK_API + 'login',
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.idToken,
            resData.expiresAt,
            'GUEST'
          );
        })
      );
  }

  autoLogin(): void {
    const userData: {
      email: string;
      _token: string;
      _tokenExpirationDate: string;
      _role: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData._token,
      new Date(userData._tokenExpirationDate),
      userData._role
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout(redirect: boolean = true): void {
    const token = this.user.value.token;
    this.user.next(null);
    if (redirect) { this.router.navigate(['/auth']); }
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.http.post<{text: string}>(
      this.API + 'user/logout?token=' + token,
      {}
    );
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    token: string,
    expirationDate: Date,
    role: string
  ): void {
    const user = new User(email, token, expirationDate, role);
    this.user.next(user);
    this.autoLogout((new Date(expirationDate)).getTime() - (new Date()).getTime());
    localStorage.setItem('userData', JSON.stringify(user));
    if (role === 'ADMIN') {
      this.setAdminSupermarket(email);
    }
  }

  setAdminSupermarket(email: string = (this.user.value ? this.user.value.email : null)): void {
    if (email === null) { return; }
    const afterAt = email.substr(email.indexOf('@') + 1); // admin@conad.it -> conad.it
    const name = afterAt.substr(0, afterAt.indexOf('.')); // conad.it -> conad
    this.marketService.chooseSupermarket(new Supermarket(name));
  }

  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    if (!errorRes.error && !errorRes.error.error) {
      return throwError('An unknown error occurred!');
    }
    let errorMessage = errorRes.error;
    if (errorRes.status === 404) {
      errorMessage = 'Invalid API URL/Request or API is offline';
    } else {
      switch (errorMessage) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This email exists already';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'This email does not exist.';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'This password is not correct.';
          break;
        default:
          errorMessage = 'Error while processing authentication';
      }
    }
    return throwError(errorMessage);
  }

  isAdmin(): boolean {
    if (this.user.value) {
      return this.user.value.role === 'ADMIN';
    }
    return false;
  }
}
