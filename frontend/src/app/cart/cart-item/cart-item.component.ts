import {Component, Input, OnInit} from '@angular/core';
import {CartItem, CartService} from '../cart.service';
import {Product} from '../../management/product/product.model';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {
  @Input() product: Product;
  @Input() cartItem: CartItem;
  deleteMessage: string = null;
  warning: string = null;
  error: string = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  onDecrementQuantity(dec: number): void {
    const tempQuantity = this.cartItem.quantity < dec ? 0 : this.cartItem.quantity - dec;
    if (tempQuantity < 1) {
      this.tryDeleteCartItem();
    } else {
      this.cartItem.quantity = tempQuantity;
      this.cartService.updateCart(this.cartItem).subscribe(
        () => {},
        errorMessage => {
          if (errorMessage === 'Token not found') {
            this.authService.logout();
          }
          this.error = errorMessage;
        }
      );
    }
  }

  onIncrementQuantity(inc: number): void {
    if (this.cartItem.quantity === this.product.quantity) {
      this.warning = 'Sorry, we have no more than ' + this.product.quantity + ' of this item right now';
      return;
    }
    if (this.product && this.cartItem) {
      if (inc + this.cartItem.quantity > this.product.quantity) {
        this.cartItem.quantity = this.product.quantity;
        this.warning = 'Sorry, we have no more than ' + this.product.quantity + ' of this item right now';
      } else {
        this.cartItem.quantity = inc + this.cartItem.quantity;
      }
      this.cartService.updateCart(this.cartItem).subscribe(
        () => {},
        errorMessage => {
          if (errorMessage === 'Token not found') {
            this.authService.logout();
          }
          this.error = errorMessage;
        }
      );
    }
  }

  cancelDelete(): void {
    this.deleteMessage = null;
  }

  tryDeleteCartItem(): void {
    this.deleteMessage = 'Do you really want to delete "' +
    this.cartItem.productName + '" from the cart?';
  }

  onDeleteCartItem(): void {
    this.cartService.deleteCart(this.cartItem).subscribe(
      () => {},
      errorMessage => {
        if (errorMessage === 'Token not found') {
          this.authService.logout();
        }
        this.error = errorMessage;
      }
    );
  }

  onClearError(): void {
    this.error = null;
  }

  onClearWarning(): void {
    this.warning = null;
  }

}
