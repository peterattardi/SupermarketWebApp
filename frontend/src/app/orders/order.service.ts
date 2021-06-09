import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {Product} from '../management/product/product.model';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {ShopProduct} from '../management/product/shop-product.model';
import {catchError, map, tap} from 'rxjs/operators';
import {MarketService} from '../shared/market.service';

export class Order {
  constructor(
    public orderId: number,
    public email: string,
    public supermarket: string,
    public createdAt: string,
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
    const supermarket = this.marketService.getSupermarket();
    let supermarketName = '';
    if (supermarket) {
      supermarketName = supermarket.name;
    } else {
      debugger;
      return throwError('Supermarket is not chosen. Please choose a supermarket first');
    }
    return this.http.get<Order>(
      this.API + 'user/order/add/' + supermarketName + '?token=' +
      (this.authService.user.value ? this.authService.user.value.token : '')
    ).pipe(
      catchError(this.handleError),
      tap( orderRes => {
        debugger;
        const newOrders = this.orders.value.slice();
        const newOrder = new Order(
          orderRes.orderId,
          orderRes.email,
          orderRes.supermarket,
          orderRes.createdAt
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
          if (order.orderId === orderId) {
            return false;
          }
          return true;
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
        this.API + 'user/orders?token=' + (this.authService.user.value ? this.authService.user.value.token : '')
      )
      .pipe(
        catchError(this.handleError),
        tap(newOrders => {
          this.orders.next(newOrders);
        })
      );
  }

  getOrder(orderId: number): Observable<OrderedProduct[]> {
    return this.http
      .get<OrderedProduct[]>(
        this.API + 'user/orders/' + orderId + '?token=' +
        (this.authService.user.value ? this.authService.user.value.token : '')
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // TODO: Handle errors from add/edit/delete
  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    if (!errorRes.error && !errorRes.error.error) {
      return throwError('An unknown error occurred!');
    }
    let errorMessage = errorRes.error;
    if (errorRes.status === 404) {
      errorMessage = 'Invalid API URL/Request or API is offline';
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
          errorMessage = 'Error while managing products';
      }
    }
    return throwError(errorMessage);
  }
}
