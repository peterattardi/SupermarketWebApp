import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, map, tap} from 'rxjs/operators';

export class Supermarket {
  id: string;
  supermarketName: string;
}

export class Position {
  constructor(
    public longitude: string,
    public latitude: string
  ) {}
}

@Injectable({ providedIn: 'root' })
export class MarketService {
  supermarket = new BehaviorSubject<string>(null);
  MOCK_API = 'https://60b3a9594ecdc1001747fac2.mockapi.io/';
  API = 'http://0584a0884918.ngrok.io/';

  constructor(private http: HttpClient) {  }

  getSupermarkets(position: Position): Observable<Supermarket[]> {
    return this.http.get<Supermarket[]>(
      this.MOCK_API + 'supermarkets'// ,
      // {
      //   longitude: position.longitude,
      //   latitude: position.latitude
      // }
    ).pipe(
      catchError(this.handleError),
      tap( resData => {
        console.log(resData);
      })
    );
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
