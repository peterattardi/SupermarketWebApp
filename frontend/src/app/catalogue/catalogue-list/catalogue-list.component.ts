import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

import { Product } from '../../management/product/product.model';
import {UserProductsService} from '../user-products.service';
import {CartItem, CartService} from '../../cart/cart.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay, take} from 'rxjs/operators';
import {AuthService} from '../../auth/auth.service';
import {MarketService, Position, Supermarket} from '../../shared/market.service';
import {Router} from '@angular/router';
import {AccountService} from '../../account/account.service';
import {User} from '../../auth/user.model';
import {AccountInfo} from '../../account/user-info.model';

@Component({
  selector: 'app-catalogue-list',
  templateUrl: './catalogue-list.component.html',
})
export class CatalogueListComponent implements OnInit, OnDestroy {
  user: User = null;
  accountInfo: AccountInfo = null;
  userSub: Subscription;

  products: Product[] = this.userProductsService.products.value;
  cartItems: CartItem[] = [];
  productSub: Subscription;
  cartSub: Subscription;

  isChangeSupermarket = false;

  supermarket: Supermarket = this.marketService.supermarket.value;
  position: Position = this.marketService.position.value;
  marketSub: Subscription;

  constructor(private userProductsService: UserProductsService,
              private cartService: CartService,
              private breakpointObserver: BreakpointObserver,
              private authService: AuthService,
              private marketService: MarketService,
              private router: Router,
              private accountService: AccountService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.accountService.getInfo()
      .pipe(take(1))
      .subscribe( userInfo => {
          if (userInfo.appUserRole === 'USER') {
            this.accountInfo = new AccountInfo(
              userInfo.email,
              userInfo.appUserRole,
              userInfo.firstName,
              userInfo.lastName,
              userInfo.locked,
              userInfo.enabled,
              userInfo.address,
              userInfo.cap,
              userInfo.city,
              userInfo.supermarketName
            );
          }
        },
        errorMessage => {
          // snackBar error
        });
    if (!this.supermarket || !this.position) {
      this.router.navigate(['/auth/supermarket']);
    }
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
  onChangeSupermarket(value: boolean): void {
    this.isChangeSupermarket = value;
  }

  onResetSupermarket(): void {
    this.cartService.cartItems.next([]);
    this.marketService.deleteSupermarket();
  }

  ngOnDestroy(): void {
    if (this.productSub) {
      this.productSub.unsubscribe();
    }
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
