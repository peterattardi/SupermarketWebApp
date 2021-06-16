import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Product } from './product.model';
import { AdminProductsService } from '../admin-products.service';
import {AuthService} from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ProductsResolverService implements Resolve<Product[]> {
  constructor(
    private adminProductsService: AdminProductsService,
    private authService: AuthService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const products = this.adminProductsService.products.value;
    if (products.length === 0) {
      return this.adminProductsService.fetchProducts()
        .subscribe(
          () => { },
          errorMessage => {
            if (errorMessage === 'Session expired') {
              this.authService.logout();
            }
          });
    } else {
      return products;
    }
  }
}
