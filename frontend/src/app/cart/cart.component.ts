import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartItem, CartService} from './cart.service';
import {Subscription} from 'rxjs';
import {MarketService} from '../shared/market.service';
import {Router} from '@angular/router';
import {Product} from '../management/product/product.model';
import {UserProductsService} from '../catalogue/user-products.service';
import {take} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';
import {OrderService} from '../orders/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  products: Product[] = this.userProductsService.products.value;
  cartSub: Subscription;
  productSub: Subscription;
  cartTotal = 0;
  error: string = null;

  constructor(
    private cartService: CartService,
    private marketService: MarketService,
    private router: Router,
    private userProductsService: UserProductsService,
    private authService: AuthService,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.productSub = this.userProductsService.products
      .subscribe(
        (products: Product[]) => {
          this.products = products;
        }
      );
    this.cartSub = this.cartService.cartItems
      .subscribe(
        cart => {
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
      if (product.productName === cartItem.productName
        && product.productBrand === cartItem.productBrand) {
          result = product;
          return;
      }
    });
    return result;
  }

  onClearError(): void {
    this.error = null;
  }

  onToOrder(): void {
    if (this.cartItems.length === 0) {
      this.error = 'Cannot order 0 products. Please add some first!';
      return;
    }
    this.orderService.addOrder()
      .pipe(take(1))
      .subscribe(
        order => {
          this.router.navigate(['/orders/' + order.orderId]);
        },
        errorMessage => {
          if (errorMessage === 'Token not found') {
            this.authService.logout();
          }
          this.error = errorMessage;
        }
      );
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

}
