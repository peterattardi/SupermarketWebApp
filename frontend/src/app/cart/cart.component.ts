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
import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from '../auth/user.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  products: Product[] = this.userProductsService.products.value;
  items: {cartItem: CartItem, product: Product}[] = [];
  cartSub: Subscription;
  productSub: Subscription;

  user: User = this.authService.user.value;
  userSub: Subscription;
  cartTotal = 0;

  constructor(
    private cartService: CartService,
    private marketService: MarketService,
    private router: Router,
    private userProductsService: UserProductsService,
    private authService: AuthService,
    private orderService: OrderService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      user => {
        this.user = user;
      }
    );
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
          this.items = [];
          this.cartTotal = 0;
          this.cartItems.forEach( cartItem => {
            const product = this.findProduct(cartItem);
            if (product) {
              this.items.push({cartItem, product});
              this.cartTotal += cartItem.quantity * product.unitCost;
            }
          });
        }
      );
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action);
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

  onToOrder(): void {
    if (this.cartItems.length === 0) {
      const message = 'Cannot order 0 products. Please add some first!';
      this.openSnackBar(message, 'Ok');
      return;
    }
    this.orderService.addOrder()
      .pipe(take(1))
      .subscribe(
        order => {
          this.cartService.cartItems.next([]);
          this.router.navigate(['/orders/' + order.orderId]);
        },
        errorMessage => {
          if (errorMessage === 'Session expired') {
            this.authService.logout();
          }
          this.openSnackBar(errorMessage, 'Ok');
        }
      );
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
    if (this.productSub) {
      this.productSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

}
