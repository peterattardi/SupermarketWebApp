import {Injectable} from '@angular/core';
import {Observable, Subject, Subscription, throwError} from 'rxjs';
import {Product} from '../management/product/product.model';
import {catchError, map, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {ShopProduct} from '../management/product/shop-product.model';
import {environment} from '../../environments/environment';
import {MarketService, Position} from '../shared/market.service';

@Injectable({providedIn: 'root'})
export class UserProductsService {
  productsChanged = new Subject<Product[]>();
  private products: Product[] = [];

  API = environment.API;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private marketService: MarketService
  ) { }

  setProducts(products: Product[]): void {
    this.products = products;
    this.productsChanged.next(this.products.slice());
  }

  setQuantity(shopProducts: ShopProduct[]): void {
    shopProducts.forEach( (shopProduct) => {
      if (shopProduct.quantity > 0) {
        let i = 0;
        let found = false;
        while (!found && i < this.products.length) {
          const product = this.products[i];
          if (product.productName === shopProduct.productName &&
            product.productBrand === shopProduct.productBrand) {
            console.log('Updated quantity', product, shopProduct.quantity);
            product.quantity = shopProduct.quantity;
            found = true;
          }
          i++;
        }
      }
    });
    debugger;
    this.productsChanged.next(this.products.slice());
  }

  getProducts(): Product[] {
    return this.products.slice();
  }

  getProduct(index: number): Product {
    return this.products[index];
  }

  fetchProducts(name: string = null): Observable<Product[]> {
    if (!name) {
      const supermarket = this.marketService.getSupermarket();
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
          this.setProducts(products);
        })
      );
  }

  fetchQuantity(position: Position): Observable<ShopProduct[]> {
    const supermarket = this.marketService.getSupermarket();
    const supermarketName = supermarket ? supermarket.name : '';
    debugger;
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
