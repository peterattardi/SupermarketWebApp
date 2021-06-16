import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {MarketService, Supermarket} from '../shared/market.service';
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
  cartItems = new BehaviorSubject<CartItem[]>([]);
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
        catchError(this.handleError),
        tap( () => {
          const newCart = this.cartItems.value.slice();
          let isNew = true;
          newCart.map( item => {
            if (item.productName === cartItem.productName
            && item.productBrand === cartItem.productBrand) {
              item.quantity = cartItem.quantity;
              isNew = false;
            }
            return item;
          });
          if (isNew) {
            newCart.push(cartItem);
          }
          this.cartItems.next(newCart);
        })
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
        catchError(this.handleError),
        tap (() => {
          const newCart = this.cartItems.value.slice().filter( (item) => {
            return item !== cartItem;
          });
          this.cartItems.next(newCart);
        })
    );
  }

  getCart(supermarket: Supermarket = this.marketService.supermarket.value): Observable<CartItem[]> {

    let supermarketName = '';
    if (supermarket) {
      supermarketName = supermarket.name;
    }
    return this.http.get<CartItem[]>(
      this.API + 'user/cart/' + supermarketName + '?token=' +
      (this.authService.user.value ? this.authService.user.value.token : ''),
    ).pipe(
      catchError(this.handleError),
      tap( cart => {
        this.cartItems.next(cart);
      })
    );
  }

  // TODO: Handle errors from add/edit/delete
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
