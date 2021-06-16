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
  error: string = null;

  constructor(
    private cartService: CartService,
    private marketService: MarketService,
    private router: Router,
    private userProductsService: UserProductsService,
    private orderService: OrderService,
    private authService: AuthService) { }

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

  onClearError(): void {
    this.error = null;
  }

  onToOrder(): void {
    if (this.cartItems.length === 0) {
      this.error = 'Cannot order 0 products. Please add some first!';
      return;
    }
    if (!this.user) {
      this.error = 'You are not authenticated. Try reload the page';
      return;
    }
    if (this.user.role !== 'USER') {
      this.error = 'Please register or login!';
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
