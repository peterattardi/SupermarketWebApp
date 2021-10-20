import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map, take, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {AdminProductsService} from '../admin-products.service';


@Injectable({ providedIn: 'root' })
export class NotificationsService {
  notifications = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient,
              private adminProductsService: AdminProductsService) { }

  getNotifications(): void {
    this.adminProductsService.getUnavailable()
      .pipe(take(1))
      .subscribe(
        products => {
          this.notifications.next(products.length);
        },
        errorMessage => {
          console.log(errorMessage);
        }
      );
  }

  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    if (!errorRes.error && !errorRes.error.error) {
      return throwError('An unknown error occurred!');
    }
    let errorMessage = errorRes.error;
    if (errorRes.status === 404 || errorRes.status === 0) {
      errorMessage = 'Invalid API URL/Request or Server is offline';
    } else {
      errorMessage = 'Error while processing locating position';
    }
    return throwError(errorMessage);
  }
}
