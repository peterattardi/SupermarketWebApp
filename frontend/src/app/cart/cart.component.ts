import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartItem, CartService} from './cart.service';
import {Subscription} from 'rxjs';
import {MarketService} from '../shared/market.service';
import {Router} from '@angular/router';
import {Product} from '../management/product/product.model';
import {UserProductsService} from '../catalogue/user-products.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  products: Product[] = [];
  cartSub: Subscription;
  productSub: Subscription;

  constructor(
    private cartService: CartService,
    private marketService: MarketService,
    private router: Router,
    private userProductsService: UserProductsService) { }

  ngOnInit(): void {
    this.productSub = this.userProductsService.productsChanged
      .subscribe(
        (products: Product[]) => {
          this.products = products;
        }
      );
    this.products = this.userProductsService.getProducts();
    this.cartSub = this.cartService.cartItems
      .subscribe(
        cart => {
          this.cartItems = cart;
        }
      );
    this.cartService.getCart().pipe(take(1)).subscribe();
  }

  findProduct(cartItem: CartItem): Product {
    let result: Product = null;
    this.products.forEach( product => {
      if (product.productName === cartItem.productName
        && product.productBrand === cartItem.productBrand) {
          result = product;
      }
    });
    return result;
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

}
