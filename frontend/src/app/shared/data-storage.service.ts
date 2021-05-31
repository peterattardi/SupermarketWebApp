import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Product } from '../management/product.model';
import { AuthService } from '../auth/auth.service';
import {ManagementService} from '../management/management.service';
import {Observable} from 'rxjs';

class MockProduct extends Product {
  constructor(name, description, imagePath, public id: string) {
    super(name, description, imagePath);
  }

  static toProducts(mockProducts: MockProduct[]): Product[] {
    const products: Product[] = [];
    mockProducts.forEach( mockProduct => {
      products.push(new Product(mockProduct.name, mockProduct.description, mockProduct.imagePath));
    });
    return products;
  }
}

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private managementService: ManagementService,
    private authService: AuthService
  ) {}

  storeProducts(): void {
    const products = this.managementService.getProducts();
    this.http
      .put( // mock api
        'https://60b3a9594ecdc1001747fac2.mockapi.io/products',
        products
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchProducts(): Observable<MockProduct[]> {
    debugger;
    return this.http
      .get<MockProduct[]>( // mock api
        'https://60b3a9594ecdc1001747fac2.mockapi.io/products'
      )
      .pipe(
        tap(mockProducts => {
          const products: Product[] = MockProduct.toProducts(mockProducts);
          this.managementService.setProducts(products);
        })
      );
  }
}
