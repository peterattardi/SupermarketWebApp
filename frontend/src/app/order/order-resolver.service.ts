import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import {UserProductsService} from './user-products.service';
import {Product} from '../management/product/product.model';
import {MarketService} from '../shared/market.service';

@Injectable({ providedIn: 'root' })
export class CatalogueResolver implements Resolve<Product[]> {
  constructor(
    private userProductsService: UserProductsService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const products = this.userProductsService.getProducts();
    if (products.length === 0) {
      return this.userProductsService.fetchProducts(true);
    } else {
      console.log('2a');
      return products;
    }
  }
}
