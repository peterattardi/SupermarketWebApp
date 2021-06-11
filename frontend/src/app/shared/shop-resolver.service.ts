import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import {Shop, ShopService} from './shop.service';

@Injectable({ providedIn: 'root' })
export class ShopResolver implements Resolve<Shop> {
  constructor(
    private shopService: ShopService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    debugger;
    this.shopService.chooseShop(new Shop(route.params.shopId));
  }
}
