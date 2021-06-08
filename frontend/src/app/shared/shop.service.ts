import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {User} from '../auth/user.model';
import {environment} from '../../environments/environment';

export class Shop {
  constructor(
    public shopId: string,
    public latitude: number,
    public longitude: number,
    public supermarketName: string) {}
}

@Injectable({ providedIn: 'root' })
export class ShopService {
  shop = new BehaviorSubject<Shop>(null);
  user: User = null;
  userSub: Subscription;
  MOCK_API = 'https://60b3a9594ecdc1001747fac2.mockapi.io/';
  API = environment.API;

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
      // this.MOCK_API + 'get-shops'
      this.API + 'admin/shops?token=' + (this.user ? this.user.token : '')
    ).pipe(
      catchError(this.handleError)
    );
  }

  // TODO: make return with an API Observable<Shop[]>
  getAllShops(): Shop[] {
    const allShops = [
      new Shop('1', 38.1190607, 13.3478169, 'conad'),
      new Shop('6', 38.1192046, 13.3489385, 'deco'),
      new Shop('10', 38.1251806, 13.3279159, 'coop'),
      new Shop('14', 38.1165093, 13.3423782, 'despar'),
    ];
    return allShops;
  }

  resetShop(redirect: boolean = true): void {
    this.shop.next(null);
    if (redirect) {
      this.router.navigate(['/management']);
    }
  }

  chooseShop(shop: Shop): void {
    this.shop.next(shop);
  }
  // TODO: handle shopService Errors
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
          errorMessage = 'Error while processing shops';
      }
    }
    return throwError(errorMessage);
  }
}
