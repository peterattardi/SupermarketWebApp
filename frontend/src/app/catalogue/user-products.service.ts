import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscription, throwError} from 'rxjs';
import {Product} from '../management/product/product.model';
import {catchError, map, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {ShopProduct} from '../management/product/shop-product.model';
import {environment} from '../../environments/environment';
import {MarketService, Position} from '../shared/market.service';

@Injectable({providedIn: 'root'})
export class UserProductsService {
  products = new BehaviorSubject<Product[]>([]);
  marketSub: Subscription;

  API = environment.API;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private marketService: MarketService
  ) {
      this.marketSub = this.marketService.supermarket.subscribe(
        supermarket => {
          if (supermarket) {
            this.fetchProducts(true, supermarket.name);
          } else {
            this.products.next([]);
          }
        }
      );
  }

  fetchProducts(withQuantity = false, name: string = null, update = true): Observable<Product[]> {
    if (!name) {
      const supermarket = this.marketService.supermarket.value;
      name = supermarket ? supermarket.name : '';
    }
    return this.http
      .get<Product[]>( // mock api
        // 'https://60b3a9594ecdc1001747fac2.mockapi.io/products'
        this.API + 'any-user/catalogue/' + name
      )
      .pipe(
        catchError(this.handleError),
        tap(products => {
          if (update) {
            this.products.next(products);
          }
          if (withQuantity) {
            this.fetchQuantity().subscribe(
              () => {},
              error => {
                console.log(error);
              }
            );
          }
        })
      );
  }

  fetchQuantity(position: Position = this.marketService.position.value): Observable<ShopProduct[]> {

    const supermarket = this.marketService.supermarket.value;
    const supermarketName = supermarket ? supermarket.name : '';
    if (!position) {
      return throwError('Invalid position.');
    }
    return this.http
      .post<ShopProduct[]>(
        this.API + 'user/nearest-shop/inventory/',
        {
          latitude: position.latitude,
          longitude: position.longitude,
          supermarketName
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(shopProducts => {
          this.setQuantity(shopProducts);
        })
      );
  }

  setQuantity(shopProducts: ShopProduct[]): void {
    const products = this.products.value;
    // find the products that have a shopProduct to update the quantity
    shopProducts.forEach( (shopProduct) => {
      if (shopProduct.quantity > 0) {
        let i = 0;
        // scan all products in order to find the one
        // with the same productName and productBrand of the shopProduct
        while (i < products.length) {
          const product = products[i];
          if (product.productName === shopProduct.productName &&
              product.productBrand === shopProduct.productBrand) {
            product.quantity = shopProduct.quantity;
            return;
          }
          i++;
        }
      }
    });
    this.products.next(products);
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
