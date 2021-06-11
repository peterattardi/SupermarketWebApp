import {Injectable} from '@angular/core';
import {AccountInfo} from './user-info.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AccountService {
  API = environment.API;

  constructor(private http: HttpClient,
              private authService: AuthService) { }


  getInfo(): Observable<AccountInfo> {
    return this.http.get<AccountInfo>(
      this.API + 'any-user/info?token=' +
      (this.authService.user.value ? this.authService.user.value.token : '')
    ).pipe(
      catchError(this.handleError)
    );
  }

  // TODO: Handle errors from add/edit/delete
  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    if (!errorRes.error && !errorRes.error.error) {
      return throwError('An unknown error occurred!');
    }
    let errorMessage = errorRes.error;
    if (errorRes.status === 404 || errorRes.status === 0) {
      errorMessage = 'Invalid API URL/Request or Server is offline';
    } else {
      switch (errorMessage) {
        case 'TOKEN_NOT_FOUND':
          errorMessage = 'Token not found';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'This email does not exist.';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'This password is not correct.';
          break;
        default:
          errorMessage = 'Error while managing products';
      }
    }
    return throwError(errorMessage);
  }
}
