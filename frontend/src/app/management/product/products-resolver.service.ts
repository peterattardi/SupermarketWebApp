import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Product } from './product.model';
import { AdminProductsService } from '../admin-products.service';

@Injectable({ providedIn: 'root' })
export class ProductsResolverService implements Resolve<Product[]> {
  constructor(
    private adminProductsService: AdminProductsService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const products = this.adminProductsService.getProducts();
    if (products.length === 0) {
      return this.adminProductsService.fetchProducts();
    } else {
      return products;
    }
  }
}
