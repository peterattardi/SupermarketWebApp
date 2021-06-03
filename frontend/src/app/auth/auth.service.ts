import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {catchError, map, tap} from 'rxjs/operators';
import {throwError, BehaviorSubject, Observable} from 'rxjs';

import { User } from './user.model';
import {SignupForm} from './signupform.model';


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
  API = 'http://0584a0884918.ngrok.io/';

  constructor(private http: HttpClient, private router: Router) {}

  signup(signupForm: SignupForm): Observable<string> {
    return this.http
      .post<{text: string}>(
        this.API + 'registration',
        {
          firstName: signupForm.firstName,
          lastName: signupForm.lastName,
          email: signupForm.email,
          password: signupForm.password,
          address: signupForm.address,
          cap: signupForm.cap,
          city: signupForm.city
        }
      )
      .pipe(
        catchError(this.handleError),
        map(resData => {
          return resData.text;
        })
      );
  }

  login(email: string, password: string, role: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        this.API + 'login',
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

  loginGuest(): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      this.API + 'guest/login',
      {}
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

  logout(): void {
    const token = this.user.value.token;
    this.user.next(null);
    this.router.navigate(['/auth']);
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
  }

  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    if (!errorRes.error && !errorRes.error.error) {
      return throwError('An unknown error occurred!');
    }
    let errorMessage = errorRes.error;
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
    }
    return throwError(errorMessage);
  }
}
