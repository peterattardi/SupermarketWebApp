import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {Product} from '../management/product/product.model';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {MarketService, Position} from '../shared/market.service';
import {ShopProduct} from '../management/product/shop-product.model';
import {catchError, tap} from 'rxjs/operators';

export class CartItem {
  constructor(
    public productName: string,
    public productBrand: string,
    public supermarketName: string,
    public quantity: number
  ) {  }

}

@Injectable({providedIn: 'root'})
export class CartService {
  // cartItems = new BehaviorSubject<CartItem[]>([]);
  API = environment.API;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private marketService: MarketService
  ) { }

  updateCart(cartItem: CartItem): Observable<string> {
    return this.http.put(
      this.API + 'user/cart/update?token=' +
      (this.authService.user.value ? this.authService.user.value.token : ''),
      {
        supermarketName: cartItem.supermarketName,
        productName: cartItem.productName,
        productBrand: cartItem.productBrand,
        quantity: cartItem.quantity
      },
      {responseType: 'text'}
    ).pipe(
        catchError(this.handleError)
    );
  }

  deleteCart(cartItem: CartItem): Observable<string> {
    return this.http.post(
      this.API + 'user/cart/delete?token=' +
      (this.authService.user.value ? this.authService.user.value.token : ''),
      {
        supermarketName: cartItem.supermarketName,
        productName: cartItem.productName,
        productBrand: cartItem.productBrand
      },
      {responseType: 'text'}
    ).pipe(
        catchError(this.handleError)
    );
  }

  getCart(supermarketName: string): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(
      this.API + 'user/cart/' + supermarketName + '?token=' +
      (this.authService.user.value ? this.authService.user.value.token : ''),
    ).pipe(
      catchError(this.handleError),
      tap( res => {
        console.log(res);
      })
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
