import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartItem, CartService} from '../../cart/cart.service';
import {Subscription} from 'rxjs';
import {MarketService} from '../../shared/market.service';
import {Router} from '@angular/router';
import {Product} from '../../management/product/product.model';
import {UserProductsService} from '../user-products.service';
import {OrderService} from '../../orders/order.service';
import {take} from 'rxjs/operators';
import {User} from '../../auth/user.model';
import {AuthService} from '../../auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart-preview',
  templateUrl: './cart-preview.component.html'
})
export class CartPreviewComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = this.cartService.cartItems.value;
  products: Product[] = this.userProductsService.products.value;
  user: User = this.authService.user.value;
  cartSub: Subscription;
  productSub: Subscription;
  userSub: Subscription;
  cartTotal = 0;

  constructor(
    private cartService: CartService,
    private marketService: MarketService,
    private router: Router,
    private userProductsService: UserProductsService,
    private orderService: OrderService,
    private authService: AuthService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.userSub = this.authService.user
      .subscribe(
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

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action);
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

  onToOrder(): void {
    if (this.cartItems.length === 0) {
      const message = 'Cannot order 0 products. Please add some first!';
      this.openSnackBar(message, 'Ok');
      return;
    }
    if (!this.user) {
      const message = 'You are not authenticated. Try reload the page';
      this.openSnackBar(message, 'Ok');
      return;
    }
    if (this.user.role !== 'USER') {
      const message = 'Please register or login!';
      this.openSnackBar(message, 'Ok');
      return;
    }
    this.orderService.addOrder()
      .pipe(take(1))
      .subscribe(
      order => {
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
  }

}
