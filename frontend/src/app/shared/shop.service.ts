import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {User} from '../auth/user.model';
import {environment} from '../../environments/environment';
import {AdminProductsService} from '../management/admin-products.service';

export class Shop {
  constructor(
    public shopId: string,
    public latitude?: number,
    public longitude?: number,
    public supermarketName?: string) {}
}

@Injectable({ providedIn: 'root' })
export class ShopService {
  shop = new BehaviorSubject<Shop>(null);
  API = environment.API;

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService,
              private route: ActivatedRoute) {  }

  getShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(
      this.API + 'admin/shops?token=' +
      (this.authService.user.value ? this.authService.user.value.token : '')
    ).pipe(
      catchError(this.handleError)
    );
  }

  getAllShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(
      this.API + 'any-user/shops'
    ).pipe(
      catchError(this.handleError)
    );
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
          errorMessage = 'Error while processing shops';
      }
    }
    return throwError(errorMessage);
  }
}
