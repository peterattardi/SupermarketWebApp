import {Injectable} from '@angular/core';
import {Observable, Subject, throwError} from 'rxjs';
import {Product} from './product/product.model';
import {catchError, map, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {ShopProduct} from './product/shop-product.model';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class AdminProductsService {
  productsChanged = new Subject<Product[]>();
  private products: Product[] = [];
  private shopId: string;

  API = environment.API;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  setShopId(shopId: string): void {
    this.shopId = shopId;
  }

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
    this.productsChanged.next(this.products.slice());
  }

  getProducts(): Product[] {
    return this.products.slice();
  }

  getProduct(index: number): Product {
    return this.products[index];
  }

  // addIngredientsToShoppingList(ingredients: Ingredient[]) {
  //   this.slService.addIngredients(ingredients);
  // }

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
      this.products.push(product);
      this.productsChanged.next(this.products.slice());
      }
    );
  }

  // TODO: edit Product
  editProduct(index: number, newProduct: Product): void {
    // TODO: send http add-product then delete-product of the old one
    const product = this.products[index];
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
        this.products[index] = newProduct;
        this.productsChanged.next(this.products.slice());
      }
    );
  }

  // TODO: delete Product
  deleteProduct(index: number): void {
    // TODO: send http delete-product
    const deleteProd = this.products[index];
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
        this.products.splice(index, 1);
        this.productsChanged.next(this.products.slice());
      }
    );
  }

  fetchProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>( // mock api
        // 'https://60b3a9594ecdc1001747fac2.mockapi.io/products'
        this.API + 'admin/catalogue?token=' + (this.authService.user.value ? this.authService.user.value.token : '')
      )
      .pipe(
        catchError(this.handleError),
        tap(products => {
          this.setProducts(products);
        })
      );
  }

  fetchQuantity(shopId: string): Observable<ShopProduct[]> {
    return this.http
      .get<ShopProduct[]>(
        this.API + 'admin/inventory/' + shopId + '?token=' + (this.authService.user.value ? this.authService.user.value.token : '')
      )
      .pipe(
        catchError(this.handleError),
        tap(shopProducts => {
          this.setQuantity(shopProducts);
        })
      );
  }

  // TODO: Handle errors from add/delete
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
