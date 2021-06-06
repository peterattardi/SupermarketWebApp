import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Product } from '../management/product/product.model';
import { AuthService } from '../auth/auth.service';
import {AdminProductsService} from '../management/admin-products.service';
import {Observable} from 'rxjs';

/*class MockProduct extends Product {
  constructor(name, description, url, public id: string) {
    super(name, description, url);
  }

  static toProducts(mockProducts: MockProduct[]): Product[] {
    const products: Product[] = [];
    mockProducts.forEach( mockProduct => {
      products.push(new Product(mockProduct.name, mockProduct.description, mockProduct.url));
    });
    return products;
  }
}*/

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private adminProductsService: AdminProductsService,
    private authService: AuthService
  ) {}


  // storeProducts(): void {
  //   const products = this.adminProductsService.getProducts();
  //   this.http
  //     .put( // mock api
  //       'https://60b3a9594ecdc1001747fac2.mockapi.io/products',
  //       products
  //     )
  //     .subscribe(response => {
  //       console.log(response);
  //     });
  // }

}
