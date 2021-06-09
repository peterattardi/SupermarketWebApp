import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartItem, CartService} from '../../../cart/cart.service';
import {Subscription} from 'rxjs';
import {MarketService} from '../../../shared/market.service';
import {Router} from '@angular/router';
import {Product} from '../../../management/product/product.model';
import {UserProductsService} from '../../user-products.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-cart-preview',
  templateUrl: './cart-preview.component.html'
})
export class CartPreviewComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = this.cartService.cartItems.value;
  products: Product[] = this.userProductsService.getProducts();
  cartSub: Subscription;
  productSub: Subscription;
  cartTotal = 0;

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
    this.cartSub = this.cartService.cartItems
      .subscribe(
        cart => {
          debugger;
          this.cartItems = cart;
          this.cartTotal = 0;
          this.cartItems.forEach( cartItem => {
            const product = this.findProduct(cartItem);
            if (product) {
              this.cartTotal += cartItem.quantity * product.unitCost;
            }
          });
        }
      );
  }

  findProduct(cartItem: CartItem): Product {
    let result: Product = null;
    this.products.forEach( product => {
      let found = false;
      if (!found && product.productName === cartItem.productName
        && product.productBrand === cartItem.productBrand) {
          result = product;
          found = true;
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
