import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscription, throwError} from 'rxjs';
import {Product} from './product/product.model';
import {catchError, map, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {ShopProduct} from './product/shop-product.model';
import {environment} from '../../environments/environment';
import {Shop, ShopService} from '../shared/shop.service';

@Injectable({providedIn: 'root'})
export class AdminProductsService {
  products = new BehaviorSubject<Product[]>([]);
  private shop: Shop = this.shopService.shop.value;

  API = environment.API;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private shopService: ShopService
  ) { }

  setShop(shopId: string, latitude?: number, longitude?: number, supermarketName?: string): void {
    this.shop = new Shop(shopId, latitude, longitude, supermarketName);
  }

  setQuantity(shopProducts: ShopProduct[]): void {
    const products = this.products.value;
    shopProducts.forEach( (shopProduct) => {
      if (shopProduct.quantity > 0) {
        let i = 0;
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

  getProduct(index: number): Product {
    return this.products.value[index];
  }

  getUnavailable(): Observable<ShopProduct[]> {
    console.log(this.shop ? 'Ok' : 'Shop is null');
    return this.http.get<ShopProduct[]>(
      this.API + 'admin/unavailables/' + this.shop.shopId + '?token=' +
      (this.authService.user ? this.authService.user.value.token : '')
    ).pipe(
      catchError(this.handleError)
    );
  }

  addProduct(product: Product): void {
    this.http.post(
      this.API + 'admin/catalogue/add?token=' +
      (this.authService.user.value ? this.authService.user.value.token : ''),
      {
        productName: product.productName,
        productBrand: product.productBrand,
        productDescription: product.productDescription,
        url: product.url,
        nutritionFacts: product.nutritionFacts,
        supplierId: product.supplierId,
        unitCost: product.unitCost,
        unitType: product.unitType
      },
      {responseType: 'text'}
    ).pipe(
      catchError(this.handleError),
      tap( response => {
        console.log(response);
      })
    ).subscribe( response => {
      console.log('Subscribe enter');
      const newProducts = this.products.value;
      newProducts.push(product);
      this.products.next(newProducts);
      },
      errorMessage => {
        if (errorMessage === 'Session expired') {
          this.authService.logout();
        }
      }
    );
  }

  editProduct(index: number, newProduct: Product): void {
    const product = this.products.value[index];
    this.http.put(
      this.API + 'admin/catalogue/update?token=' +
      (this.authService.user.value ? this.authService.user.value.token : ''),
      {
        oldProductName: product.productName,
        oldProductBrand: product.productBrand,
        newProductName: newProduct.productName,
        newProductBrand: newProduct.productBrand,
        productDescription: newProduct.productDescription,
        url: newProduct.url,
        nutritionFacts: newProduct.nutritionFacts,
        supplierId: newProduct.supplierId,
        unitCost: newProduct.unitCost,
        unitType: newProduct.unitType
      },
      {responseType: 'text'}
    ).pipe(
      catchError(this.handleError),
      tap( response => {
        console.log(response);
      })
    ).subscribe( response => {
        console.log('updating new product');
        newProduct.quantity = product.quantity;
        const newProducts = this.products.value;
        newProducts[index] = newProduct;
        this.products.next(newProducts);
      },
      errorMessage => {
        if (errorMessage === 'Session expired') {
          this.authService.logout();
        }
      }
    );
  }

  deleteProduct(index: number): void {
    const deleteProd = this.products.value[index];
    this.http.post(
      this.API + 'admin/catalogue/delete?token=' +
      (this.authService.user.value ? this.authService.user.value.token : ''),
      {
        productName: deleteProd.productName,
        productBrand: deleteProd.productBrand
      },
      {responseType: 'text'}
    ).pipe(
      catchError(this.handleError),
      tap( response => {
        console.log(response);
      })
    ).subscribe( response => {
        console.log('deleting old product');
        const newProducts = this.products.value;
        newProducts.splice(index, 1);
        this.products.next(newProducts);
      },
      errorMessage => {
        if (errorMessage === 'Session expired') {
          this.authService.logout();
        }
      }
    );
  }

  fetchProducts(withQuantity: boolean = false): Observable<Product[]> {
    return this.http
      .get<Product[]>(
        this.API + 'admin/catalogue?token=' +
        (this.authService.user.value ? this.authService.user.value.token : '')
      )
      .pipe(
        catchError(this.handleError),
        tap(products => {
          this.products.next(products);
          if (withQuantity && this.shop) {
            this.fetchQuantity(this.shop.shopId).subscribe(
              () => { },
              errorMessage => {
                this.authService.logout();
              }
            );
          }
        })
      );
  }

  fetchQuantity(shopId: string = this.shop.shopId): Observable<ShopProduct[]> {
    return this.http
      .get<ShopProduct[]>(
        this.API + 'admin/inventory/' + shopId + '?token=' +
        (this.authService.user.value ? this.authService.user.value.token : '')
      )
      .pipe(
        catchError(this.handleError),
        tap(shopProducts => {
          this.setQuantity(shopProducts);
        })
      );
  }

  updateQuantity(index: number, product: Product, quantity: number): void {
    this.http.put(
      this.API + 'admin/inventory/update?token=' +
      (this.authService.user.value ? this.authService.user.value.token : ''),
      {
        shopId: this.shop.shopId,
        productName: product.productName,
        productBrand: product.productBrand,
        quantity
      },
      {responseType: 'text'}
    ).pipe(
      catchError(this.handleError),
      tap( response => {
        console.log(response);
      })
    ).subscribe( () => {
        const newProducts = this.products.value;
        newProducts[index].quantity = quantity;
        this.products.next(newProducts);
      },
      errorMessage => {
        if (errorMessage === 'Session expired') {
          this.authService.logout();
        }
      }
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
