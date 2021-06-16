import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import {CartService} from '../cart/cart.service';
import {ActivatedRoute} from '@angular/router';
import {AdminProductsService} from '../management/admin-products.service';
import {Shop, ShopService} from '../shared/shop.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isGuest: boolean;
  isUser: boolean;
  shop: Shop = this.shopService.shop.value;
  private userSub: Subscription;
  private fetchSub: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private shopService: ShopService
  ) {}

  ngOnInit(): void {
    this.shopService.shop.subscribe(
      shop => {
        this.shop = shop;
      }
    );
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = false;
      this.isAdmin = false;
      this.isUser = false;
      this.isGuest = false;
      if (user) {
        this.isAuthenticated = true;
        if (user.role === 'ADMIN') {
          this.isAdmin = true;
        } else if (user.role === 'USER') {
          this.isUser = true;
        } else {
          this.isGuest = true;
        }
      }
    });
  }

  onLogout(): void {
    if (this.cartService.cartItems.value.length > 0) {
      this.cartService.cartItems.next([]);
    }
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.fetchSub) {
      this.fetchSub.unsubscribe();
    }
  }
}
