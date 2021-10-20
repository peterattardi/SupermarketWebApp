import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {catchError, map, tap} from 'rxjs/operators';
import {MarketService} from '../shared/market.service';

export class Order {
  constructor(
    public orderId: number,
    public email: string,
    public supermarket: string,
    public createdAt: string,
    public confirmed: boolean
  ) {
  }
}

export class OrderedProduct {
  constructor(
    public orderedProductId: number,
    public productName: string,
    public productBrand: string,
    public quantity: number,
    public orderId: number,
  ) {
  }
}

@Injectable({providedIn: 'root'})
export class OrderService {
  orders = new BehaviorSubject<Order[]>([]);

  API = environment.API;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private marketService: MarketService
  ) { }

  addOrder(): Observable<Order> {
    const supermarket = this.marketService.supermarket.value;
    let supermarketName = '';
    if (supermarket) {
      supermarketName = supermarket.name;
    } else {
      return throwError('Supermarket is not chosen. Please choose a supermarket first');
    }
    return this.http.get<Order>(
      this.API + 'user/order/add/' + supermarketName + '?token=' +
      (this.authService.user.value ? this.authService.user.value.token : '')
    ).pipe(
      catchError(this.handleError),
      tap( orderRes => {
        const newOrders = this.orders.value.slice();
        const newOrder = new Order(
          orderRes.orderId,
          orderRes.email,
          orderRes.supermarket,
          orderRes.createdAt,
          orderRes.confirmed
        );
        newOrders.push(newOrder);
        this.orders.next(newOrders);
      })
    );
  }

  deleteOrder(orderId: number): Observable<string> {
    return this.http.delete(
      this.API + 'user/order/delete/' + orderId + '?token=' +
      (this.authService.user.value ? this.authService.user.value.token : ''),
      {responseType: 'text'}
    ).pipe(
      catchError(this.handleError),
      map( response => {
        const newOrders = this.orders.value.filter( order => {
          return order.orderId !== orderId;
        });
        this.orders.next(newOrders);
        console.log('deleteMsg: ', response);
        return 'delete success';
      })
    );
  }

  getOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(
        this.API + 'user/orders?token='
        + (this.authService.user.value ? this.authService.user.value.token : '')
      )
      .pipe(
        catchError(this.handleError),
        tap(newOrders => {
          this.orders.next(newOrders);
        })
      );
  }

  getOrderById(orderId: number): Order {
    let result: Order = null;
    this.orders.value.forEach( order => {
      if (order.orderId === orderId) {
        result = order;
      }
    });
    return result;
  }

  getOrderedProducts(orderId: number): Observable<OrderedProduct[]> {
    return this.http
      .get<OrderedProduct[]>(
        this.API + 'user/orders/' + orderId + '?token=' +
        (this.authService.user.value ? this.authService.user.value.token : '')
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  confirmOrder(orderId: number): Observable<string> {
    return this.http.put(
      this.API + 'user/order/confirm/' + orderId,
      {},
      {responseType: 'text'}
    ).pipe(
      catchError(this.handleError),
      tap( () => {
        this.setConfirm(orderId, true);
      })
    );
  }

  cancelOrder(orderId: number): Observable<string> {
    return this.http.put(
      this.API + 'user/order/disconfirm/' + orderId,
      {},
      {responseType: 'text'}
    ).pipe(
      catchError(this.handleError),
      tap( () => {
          this.setConfirm(orderId, false);
      })
    );
  }

  isConfirmed(orderId: number): boolean {
    let result = false;
    this.orders.value.forEach( order => {
      if (order.orderId === orderId) {
        result = order.confirmed;
      }
    });
    return result;
  }

  private setConfirm(orderId: number, confirmed: boolean): void {
    const updatedOrders = this.orders.value;
    if (updatedOrders.length === 0) {
      throwError('There is no orders to confirm');
    }
    updatedOrders.map( order => {
      if (order.orderId === orderId) {
        order.confirmed = confirmed;
      }
      return order;
    });
    this.orders.next(updatedOrders);
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
