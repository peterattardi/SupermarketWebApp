import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {mark} from '@angular/compiler-cli/src/ngtsc/perf/src/clock';
import {environment} from '../../environments/environment';

export class Supermarket {
  constructor(
    public name: string){}
}

export class Position {
  constructor(
    public latitude: string,
    public longitude: string
  ) {}
}

@Injectable({ providedIn: 'root' })
export class MarketService {
  supermarket = new BehaviorSubject<Supermarket>(null);
  MOCK_API = 'https://60b3a9594ecdc1001747fac2.mockapi.io/';
  API = environment.API;

  constructor(private http: HttpClient,
              private router: Router) {  }

  getSupermarkets(position: Position): Observable<Supermarket[]> {
    return this.http.post<Supermarket[]>(
      this.API + 'user/nearest-supermarkets',
      // this.MOCK_API + 'supermarkets'// ,
      {
        longitude: position.longitude,
        latitude: position.latitude
      }
    ).pipe(
      catchError(this.handleError),
      tap( resData => {
        console.log(resData);
      })
    );
  }

  deleteSupermarket(redirect: boolean = true): void {
    localStorage.removeItem('supermarket');
    this.supermarket.next(null);
    if (redirect) {
      this.router.navigate(['/auth/supermarket']);
    }
  }

  getSupermarket(): Supermarket {
    const market = JSON.parse(localStorage.getItem('supermarket'));
    // if supermarket is null or is different from the one in LocalStorage (and market exists)
    if (market) {
      if (!this.supermarket.value || (market.name !== this.supermarket.value.name)) {
        this.supermarket.next(new Supermarket(market.name));
      }
    }
    return market;
  }

  chooseSupermarket(market: Supermarket): void {
    this.supermarket.next(market);
    localStorage.setItem('supermarket', JSON.stringify(market));
  }

  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    if (!errorRes.error && !errorRes.error.error) {
      return throwError('An unknown error occurred!');
    }
    let errorMessage = errorRes.error;
    if (errorRes.status === 404) {
      errorMessage = 'Invalid API Request or API is offline';
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
          errorMessage = 'Error while processing supermarkets';
      }
    }
    return throwError(errorMessage);
  }
}
