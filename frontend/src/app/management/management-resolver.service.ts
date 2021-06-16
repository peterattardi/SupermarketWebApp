import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import {Product} from './product/product.model';
import {AdminProductsService} from './admin-products.service';

@Injectable({ providedIn: 'root' })
export class ManagementResolver implements Resolve<Product[]> {
  constructor(
    private adminProductsService: AdminProductsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    this.adminProductsService.setShop(route.params.shopId);
    const products = this.adminProductsService.products.value;
    if (products.length === 0) {
      return this.adminProductsService.fetchProducts(true);
    } else {
      return products;
    }
  }
}
