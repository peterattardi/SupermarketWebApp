import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {Position} from './market.service';
import {environment} from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class PositionService {

  constructor(private http: HttpClient) { }

  getPositionByAddress(addr: string): Observable<Position> {
    const parsedAddr = addr.replace(' ', '+');
    return this.http.get<Position>(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' + parsedAddr +
      '&key=' + environment.GOOGLE_API_KEY
    ).pipe(
      catchError(this.handleError),
      map( res => {
        // @ts-ignore
        const pos = res.results[0].geometry.location;
        return new Position(pos.lat, pos.lng);
      })
    );
  }

  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    if (!errorRes.error && !errorRes.error.error) {
      return throwError('An unknown error occurred!');
    }
    let errorMessage = errorRes.error;
    if (errorRes.status === 404) {
      errorMessage = 'Invalid API URL/Request or API is offline';
    } else {
      errorMessage = 'Error while processing locating position';
    }
    return throwError(errorMessage);
  }
}
