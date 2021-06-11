import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {OrderService} from './order.service';

@Injectable({ providedIn: 'root' })
export class OrderGuard implements CanActivate {
  constructor(
    private orderService: OrderService,
    private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot):
        boolean | UrlTree
        | Promise<boolean | UrlTree>
        | Observable<boolean | UrlTree> {

    const orderId = route.params.orderId;
    if (!orderId) {
      console.log('orderId not found');
      return this.router.createUrlTree(['/orders']);
    }
    return this.orderService.getOrders()
      .pipe(
        take(1),
        map(orders => {
          let found = false;
          orders.forEach( order => {
            if (order.orderId === +orderId) {
              found = true;
            }
          });
          return (found ? true : this.router.createUrlTree(['/orders']));
        })
      );
  }
}
