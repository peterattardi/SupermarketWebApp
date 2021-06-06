import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';
import {MarketService} from '../shared/market.service';

@Injectable({ providedIn: 'root' })
export class SupermarketGuard implements CanActivate {
  constructor(private marketService: MarketService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    const supermarket = this.marketService.getSupermarket();
    const isChosen = !!supermarket;
    if (isChosen) {
      return true;
    }
    return this.router.createUrlTree(['/auth/supermarket']);
      // tap(isAuth => {
      //   if (!isAuth) {
      //     this.router.navigate(['/auth']);
      //   }
      // })
  }
}
