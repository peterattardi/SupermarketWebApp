import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {Shop} from './shop.service';

export class Supermarket {
  constructor(
    public name: string){}
}

export class Position {
  constructor(
    public latitude: number,
    public longitude: number
  ) {}
}

@Injectable({ providedIn: 'root' })
export class MarketService {
  supermarket = new BehaviorSubject<Supermarket>(null);
  position = new BehaviorSubject<Position>(null);
  MOCK_API = 'https://60b3a9594ecdc1001747fac2.mockapi.io/';
  API = environment.API;

  constructor(private http: HttpClient,
              private router: Router) {  }

  getSupermarkets(position: Position): Observable<Shop[]> {
    return this.http.post<Shop[]>(
      this.API + 'user/nearest-supermarkets',
      {
        longitude: position.longitude,
        latitude: position.latitude
      }
    ).pipe(
      catchError(this.handleError)
    );
  }

  deleteSupermarket(redirect: boolean = true): void {
    localStorage.removeItem('supermarket');
    localStorage.removeItem('position');
    this.supermarket.next(null);
    this.position.next(null);
    if (redirect) {
      this.router.navigate(['/auth/supermarket']);
    }
  }

  // Parse position from localstorage and update the position if it exists
  parsePosition(): void {
    const pos = JSON.parse(localStorage.getItem('position'));
    if (pos) {
      const newPos = new Position(pos.latitude, pos.longitude);
      this.position.next(newPos);
    }
  }

  // Parse supermarket from localstorage and update the supermarket if it exists
  parseSupermarket(): void {
    const market = JSON.parse(localStorage.getItem('supermarket'));
    if (market) {
      this.supermarket.next(new Supermarket(market.name));
    }
  }

  chooseSupermarket(market: Supermarket, position: Position = null): void {
    if (position) {
      this.position.next(position);
      localStorage.setItem('position', JSON.stringify(position));
    }
    this.supermarket.next(market);
    localStorage.setItem('supermarket', JSON.stringify(market));
  }

  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    if (!errorRes.error && !errorRes.error.error) {
      return throwError('An unknown error occurred!');
    }

    let errorMessage = errorRes.error;
    console.log(errorRes);
    if (errorRes.status === 404 || errorRes.status === 0) {
      errorMessage = 'Invalid API Request or Server is offline';
    } else if (errorRes.message === 'LATITUDE_NULL' || errorRes.message === 'LONGITUDE_NULL') {
      errorMessage = 'There is an error with position';
    } else if (errorRes.status === 500) {
      errorMessage = errorRes.statusText;
    }
    return throwError(errorMessage);
  }
}
