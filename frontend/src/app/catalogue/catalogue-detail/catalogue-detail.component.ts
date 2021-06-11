import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Product } from '../../management/product/product.model';
import {Subscription} from 'rxjs';
import {UserProductsService} from '../user-products.service';
import {CartItem, CartService} from '../../cart/cart.service';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-catalogue-detail',
  templateUrl: './catalogue-detail.component.html',
})
export class CatalogueDetailComponent implements OnInit, OnDestroy {
  subProduct: Subscription;
  product: Product;
  id: number;
  quantity = 0;
  cartItems: CartItem[] = [];
  cartItem: CartItem;
  cartSub: Subscription;
  error: string = null;
  warning: string = null;
  info: string = null;

  constructor(private userProductsService: UserProductsService,
              private route: ActivatedRoute,
              private cartService: CartService,
              private authService: AuthService) {
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
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
  }

}
