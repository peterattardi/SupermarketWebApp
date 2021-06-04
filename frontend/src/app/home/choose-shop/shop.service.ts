import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Position} from '../../auth/choose-market/market.service';
import {AuthService} from '../../auth/auth.service';
import {User} from '../../auth/user.model';

export class Shop {
  shopId: string;
  supermarketName: string;
}

@Injectable({ providedIn: 'root' })
export class ShopService {
  shop = new BehaviorSubject<Shop>(null);
  user: User = null;
  userSub: Subscription;
  MOCK_API = 'https://60b3a9594ecdc1001747fac2.mockapi.io/';
  API = 'http://0584a0884918.ngrok.io/';

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService) {
    this.userSub = this.authService.user.subscribe(
      user => {
        this.user = user;
      }
    );
    this.user = this.authService.user.value;
  }

  getShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(
      this.MOCK_API + 'get-shops' // + '?token=' + (this.user ? this.user.token : '')
    ).pipe(
      catchError(this.handleError),
      tap( resData => {
        console.log(resData);
      })
    );
  }

  resetShop(redirect: boolean = true): void {
    localStorage.removeItem('shop');
    this.shop.next(null);
    if (redirect) {
      this.router.navigate(['/home']);
    }
  }

  getShop(): Shop {
    const shop = JSON.parse(localStorage.getItem('shop'));
    this.shop.next(shop);
    return shop;
  }

  chooseShop(shop: Shop): void {
    this.shop.next(shop);
    localStorage.setItem('shop', JSON.stringify(shop));
  }

  // TODO: handle shopService Errors
  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    if (!errorRes.error && !errorRes.error.error) {
      return throwError('An unknown error occurred!');
    }
    let errorMessage = errorRes.error;
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
    }
    return throwError(errorMessage);
  }
}
