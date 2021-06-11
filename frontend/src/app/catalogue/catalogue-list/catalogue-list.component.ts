import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import { Subscription } from 'rxjs';

import { Product } from '../../management/product/product.model';
import {UserProductsService} from '../user-products.service';
import {CartItem, CartService} from '../../cart/cart.service';

@Component({
  selector: 'app-catalogue-list',
  templateUrl: './catalogue-list.component.html',
})
export class CatalogueListComponent implements OnInit, OnDestroy {
  products: Product[] = this.userProductsService.products.value;
  cartItems: CartItem[] = [];
  productSub: Subscription;
  cartSub: Subscription;

  constructor(private userProductsService: UserProductsService,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.productSub = this.userProductsService.products
      .subscribe(
        (products: Product[]) => {
          this.products = products;
        }
      );
    if (this.products.length === 0) {
      console.log('It should not enter here! CHECK (resolver is not working?)');
      this.userProductsService.fetchProducts().subscribe();
    }
    this.cartSub = this.cartService.cartItems.subscribe(
      cart => {
        this.cartItems = cart;
      }
    );
  }

  findCart(product: Product): CartItem {
    let result: CartItem = null;
    this.cartItems.forEach( item => {
      let found = false;
      if (!found && item.productName === product.productName
        && item.productBrand === product.productBrand) {
        result = item;
        found = true;
      }
    });
    return result;
  }

  ngOnDestroy(): void {
    if (this.productSub) {
      this.productSub.unsubscribe();
    }
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }
}
