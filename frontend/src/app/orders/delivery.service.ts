import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {Order} from './order.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';

export class Delivery {
  constructor(
    public orderId: number,
    public address: string,
    public payment: string,
    public date: Date
  ) {
  }
}

@Injectable({providedIn: 'root'})
export class DeliveryService {
  API = environment.API;

  constructor(
    private http: HttpClient) { }

  scheduleDelivery(delivery: Delivery): Observable<string> {
    return this.http.post(
      this.API + 'user/delivery/schedule',
      {
        orderId: delivery.orderId,
        address: delivery.address,
        payment: delivery.payment,
        date: delivery.date
      },
      {responseType: 'text'}
    ).pipe(
      catchError(this.handleError)
    );
  }

  getDelivery(orderId: number): Observable<Delivery> {
    return this.http.get<Delivery>(
      this.API + 'user/delivery/' + orderId
    ).pipe(
      catchError(this.handleError)
    );
  }

  updateDelivery(delivery: Delivery): Observable<string> {
    return this.http.put(
      this.API + 'user/delivery/update/' + delivery.orderId,
      {
        address: delivery.address,
        date: delivery.date,
        payment: delivery.payment
      },
      {responseType: 'text'}
    ).pipe(
      catchError(this.handleError)
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
      switch (errorMessage) {
        case 'TOKEN_NOT_FOUND':
          errorMessage = 'Session expired';
          break;
        case 'DELIVERY_NOT_FOUND':
          errorMessage = 'Delivery not found.';
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
