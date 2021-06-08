import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartItem, CartService} from './cart.service';
import {Subscription} from 'rxjs';
import {MarketService} from '../shared/market.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartSub: Subscription;

  constructor(
    private cartService: CartService,
    private marketService: MarketService,
    private router: Router) { }

  ngOnInit(): void {
    const supermarket = this.marketService.getSupermarket();
    if (!supermarket) {
      this.router.navigate(['/auth/supermarket']);
    }
    this.cartSub = this.cartService.getCart(supermarket.name)
      .subscribe(
        cart => {
          this.cartItems = cart;
        }
      );
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

}
