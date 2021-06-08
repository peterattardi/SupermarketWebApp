import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Position} from './market.service';
import {environment} from '../../environments/environment';

export class IpStackResponse {
  ip: string;
  latitude: number;
  longitude: number;

}

@Injectable({ providedIn: 'root' })
export class PositionService {
  API_KEY = 'ce70d689cc51735e73d6838ecd57ea05';
  URL = 'http://api.ipstack.com/';
  CURRENT_POS_URL = this.URL + 'check?access_key=' + this.API_KEY;

  constructor(private http: HttpClient) { }

  getPositionByAddress(addr: string): Observable<Position> {
    const parsedAddr = addr.replace(' ', '+');
    return this.http.get<Position>(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' + parsedAddr +
      '&key=' + environment.GOOGLE_API_KEY
    ).pipe(
      catchError(this.handleError),
      tap( res => {
        // @ts-ignore
        const pos = res.results.geometry.location;
        return new Position(pos.latitude, pos.longitude);
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
