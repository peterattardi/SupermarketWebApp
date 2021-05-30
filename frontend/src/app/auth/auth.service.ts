import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import {throwError, BehaviorSubject, Observable} from 'rxjs';

import { User } from './user.model';
import {SignupForm} from './signupform.model';

export interface AuthResponseData {
  token: string;
  email: string;
  expirationDate: Date;
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(signupForm: SignupForm): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        'https://60b3a9594ecdc1001747fac2.mockapi.io/registration',
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
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.token,
            resData.expirationDate,
            Role.USER
          );
        })
      );
  }

  login(email: string, password: string, role: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        'https://60b3a9594ecdc1001747fac2.mockapi.io/login',
        {
          username: email,
          password,
          appUserRole: role
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.token,
            resData.expirationDate,
            role
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
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
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
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
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
