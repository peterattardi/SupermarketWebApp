import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import {CartItem, CartService} from './cart.service';
import {AuthService} from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class CartResolver implements Resolve<CartItem[]> {
  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const cartItems = this.cartService.cartItems.value;
    if (cartItems.length === 0) {
      return this.cartService.getCart().subscribe(
        () => {},
        errorMessage => {
          if (errorMessage === 'Session expired') {
            this.authService.logout();
          }
        }
      );
    } else {
      return cartItems;
    }
  }
}
