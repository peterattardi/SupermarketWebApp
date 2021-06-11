import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, Router
} from '@angular/router';

import {Product} from '../management/product/product.model';
import {OrderService} from './order.service';
import {AuthService} from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class OrderResolver implements Resolve<Product[]> {
  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const orderId = route.params.orderId;
    this.orderService.getOrders().subscribe(
      newOrders => {
        let found = false;
        newOrders.forEach( order => {
          if (order.orderId === +orderId) {
            found = true;
          }
        });
        return (found ? true : this.router.navigate(['/orders']));
      },
      error => {
        if (error === 'Token not found') {
          this.authService.logout();
        }
        console.log(error);
      }
    );
  }
}
