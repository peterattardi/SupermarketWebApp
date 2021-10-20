import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {MarketService} from '../shared/market.service';

@Injectable({ providedIn: 'root' })
export class MarketGuard implements CanActivate {
  constructor(private marketService: MarketService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {

    this.marketService.parseSupermarket();
    this.marketService.parsePosition();
    const supermarket = this.marketService.supermarket.value;
    const position = this.marketService.position.value;
    if (!supermarket || !position) {
      return this.router.createUrlTree(['/auth/supermarket']);
    }
    return true;
  }
}
