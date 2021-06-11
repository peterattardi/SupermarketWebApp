import {Component, OnInit, Input, OnDestroy} from '@angular/core';

import { Product } from '../../../management/product/product.model';
import {CartItem, CartService} from '../../../cart/cart.service';
import {AuthService} from '../../../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-catalogue-item',
  templateUrl: './catalogue-item.component.html',
})
export class CatalogueItemComponent implements OnInit, OnDestroy {
  @Input() product: Product;
  @Input() index: number;
  @Input() cartItem: CartItem;
  quantity = 0;
  error: string = null;
  warning: string = null;
  info: string = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService) {}


  ngOnInit(): void {
  }


  onAddToCart(): void {
    if (this.quantity < 1) {
      this.warning = 'Cannot add negative or 0 items';
      return;
    }
    if (this.product.quantity <
      (this.cartItem ? this.cartItem.quantity : 0) + this.quantity) {
      this.error = 'Sorry, this is product in unavailable right now';
      return;
    }
    let currentQuantity = 0;
    if (this.cartItem) {
      currentQuantity = this.cartItem.quantity + this.quantity;
    } else {
      currentQuantity = this.quantity;
    }
    const newQuantity = (this.product.quantity < currentQuantity ? this.product.quantity : currentQuantity);
    this.cartItem = new CartItem(
      this.product.productName,
      this.product.productBrand,
      this.product.supermarketName,
      newQuantity
    );
    this.cartService.updateCart(this.cartItem).subscribe(
      () => {
        this.info = 'Added to cart: ' +
          this.product.productName + ' (+' +
          this.quantity + ')';
      },
      errorMessage => {
        if (errorMessage === 'Token not found') {
          this.authService.logout();
        }
        this.error = errorMessage;
      }
    );
  }

  onClearInfo(): void {
    this.info = null;
  }

  onClearWarning(): void {
    this.warning = null;
  }

  onClearError(): void {
    this.error = null;
  }

  ngOnDestroy(): void {
  }
}
