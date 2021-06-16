import {Component, OnInit, Input, OnDestroy} from '@angular/core';

import { Product } from '../../../management/product/product.model';
import {CartItem, CartService} from '../../../cart/cart.service';
import {AuthService} from '../../../auth/auth.service';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-catalogue-item',
  templateUrl: './catalogue-item.component.html',
})
export class CatalogueItemComponent implements OnInit, OnDestroy {
  @Input() product: Product;
  @Input() index: number;
  @Input() cartItem: CartItem;
  quantity = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private snackBar: MatSnackBar) {}


  ngOnInit(): void {
  }


  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action);
  }

  onAddToCart(): void {
    if (this.quantity < 1) {
      const message = 'Cannot add negative or 0 items';
      this.openSnackBar(message, 'Ok');
      return;
    }
    if (this.product.quantity <
      (this.cartItem ? this.cartItem.quantity : 0) + this.quantity) {
      const message = 'Sorry, this is product in unavailable right now';
      this.openSnackBar(message, 'Ok');
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
        const message = 'Added to cart: ' +
          this.product.productName + ' (+' +
          this.quantity + ')';
        this.openSnackBar(message, 'Dismiss');
      },
      errorMessage => {
        if (errorMessage === 'Session expired') {
          this.authService.logout();
        }

        this.openSnackBar(errorMessage, 'Ok');
      },
      () => {
        this.quantity = null;
      }
    );
  }

  ngOnDestroy(): void {
  }
}
