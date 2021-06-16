import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../auth/user.model';
import {Observable, Subscription} from 'rxjs';
import {MarketService, Position, Supermarket} from '../shared/market.service';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {UserProductsService} from './user-products.service';
import {CartItem, CartService} from '../cart/cart.service';
import {map, shareReplay, take} from 'rxjs/operators';
import {AccountInfo} from '../account/user-info.model';
import {AccountService} from '../account/account.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html'
})
export class CatalogueComponent implements OnInit, OnDestroy {
  user: User = null;
  accountInfo: AccountInfo = null;
  userSub: Subscription;

  isChangeSupermarket = false;

  supermarket: Supermarket = this.marketService.supermarket.value;
  position: Position = this.marketService.position.value;
  cartItems: CartItem[] = this.cartService.cartItems.value;
  marketSub: Subscription;
  cartSub: Subscription;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  constructor(private authService: AuthService,
              private marketService: MarketService,
              private router: Router,
              private userProductsService: UserProductsService,
              private cartService: CartService,
              private accountService: AccountService,
              private breakpointObserver: BreakpointObserver,
              private snackBar: MatSnackBar) { }

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
        this.openSnackBar(errorMessage, 'Ok');
      });
    this.cartSub = this.cartService.cartItems.subscribe(
      cartItems => {
        this.cartItems = cartItems;
      }
    );
    if (!this.supermarket || !this.position) {
      this.router.navigate(['/auth/supermarket']);
    }
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action);
  }

  onChangeSupermarket(value: boolean): void {
    this.isChangeSupermarket = value;
  }

  onResetSupermarket(): void {
    this.cartService.cartItems.next([]);
    this.marketService.deleteSupermarket();
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.cartSub) {
     this.cartSub.unsubscribe();
    }
  }
}
