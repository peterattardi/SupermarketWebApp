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
  quantity = 1;

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
          this.product = this.userProductsService.getProduct(this.id);
        }
      );
    this.subProduct = this.userProductsService.productsChanged.subscribe(
      products => {
        this.product = products[this.id];
      }
    );
  }

  onAddToCart(): void {
    const newQuantity = (this.product.quantity < this.quantity ? this.product.quantity : this.quantity);
    const cartItem = new CartItem(
      this.product.productName,
      this.product.productBrand,
      this.product.supermarketName,
      newQuantity
    );
    this.cartService.updateCart(cartItem).subscribe(
      res => {
        alert('Added to cart: ' +
        this.product.productName + ' (' +
        newQuantity + ')');
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
  }

}
