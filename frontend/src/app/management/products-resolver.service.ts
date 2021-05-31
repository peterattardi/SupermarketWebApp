import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Product } from './product.model';
import { DataStorageService } from '../shared/data-storage.service';
import { ManagementService } from './management.service';

@Injectable({ providedIn: 'root' })
export class ProductsResolverService implements Resolve<Product[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private managementService: ManagementService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const products = this.managementService.getProducts();
    debugger;
    if (products.length === 0) {
      return this.dataStorageService.fetchProducts();
    } else {
      return products;
    }
  }
}
