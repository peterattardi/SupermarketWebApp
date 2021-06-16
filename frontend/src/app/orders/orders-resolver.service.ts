import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import {Product} from '../management/product/product.model';
import {OrderService} from './order.service';
import {AuthService} from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class OrdersResolver implements Resolve<Product[]> {
  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const orders = this.orderService.orders.value;
    if (orders.length === 0) {
      return this.orderService.getOrders()
        .subscribe(
        () => {},
        error => {
          if (error === 'Session expired') {
            this.authService.logout();
          }
          console.log(error);
        }
      );
    } else {
      return orders;
    }
  }
}
