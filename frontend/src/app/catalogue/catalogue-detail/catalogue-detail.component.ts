import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Product } from '../../management/product/product.model';
import {Subscription} from 'rxjs';
import {UserProductsService} from '../user-products.service';
import {CartItem, CartService} from '../../cart/cart.service';
import {AuthService} from '../../auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-catalogue-detail',
  templateUrl: './catalogue-detail.component.html',
})
export class CatalogueDetailComponent implements OnInit, OnDestroy {
  subProduct: Subscription;
  product: Product;
  id: number;
  quantity: number;
  cartItems: CartItem[] = [];
  cartItem: CartItem;
  cartSub: Subscription;

  constructor(private userProductsService: UserProductsService,
              private route: ActivatedRoute,
              private cartService: CartService,
              private authService: AuthService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params.id;
          this.product = this.userProductsService.products.value[this.id];
        }
      );
    this.subProduct = this.userProductsService.products.subscribe(
      products => {
        this.product = products[this.id];
      }
    );
    this.cartSub = this.cartService.cartItems.subscribe(
      cart => {
        this.cartItems = cart;
        this.cartItems.forEach( item => {
          if (item.productName === this.product.productName && item.productBrand === this.product.productBrand) {
            this.cartItem = item;
          }
        });
      }
    );
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
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
  }

}
