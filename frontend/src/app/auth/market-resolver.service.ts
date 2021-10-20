import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import {Product} from '../management/product/product.model';
import {MarketService, Supermarket} from '../shared/market.service';

@Injectable({ providedIn: 'root' })
export class MarketResolver implements Resolve<Supermarket> {
  constructor(
    private marketService: MarketService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    this.marketService.parseSupermarket();
    this.marketService.parsePosition();
  }
}
