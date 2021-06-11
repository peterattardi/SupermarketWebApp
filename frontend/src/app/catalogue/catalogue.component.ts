import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../auth/user.model';
import {Subscription} from 'rxjs';
import {MarketService, Position, Supermarket} from '../shared/market.service';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {UserProductsService} from './user-products.service';
import {CartService} from '../cart/cart.service';
import {take} from 'rxjs/operators';
import {AccountInfo} from '../account/user-info.model';
import {AccountService} from '../account/account.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html'
})
export class CatalogueComponent implements OnInit, OnDestroy {
  user: User = null;
  accountInfo: AccountInfo = null;
  userSub: Subscription;

  supermarket: Supermarket = this.marketService.supermarket.value;
  position: Position = this.marketService.position.value;
  marketSub: Subscription;

  error: string = null;

  constructor(private authService: AuthService,
              private marketService: MarketService,
              private router: Router,
              private userProductsService: UserProductsService,
              private cartService: CartService,
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
      });
    if (!this.supermarket || !this.position) {
      this.router.navigate(['/auth/supermarket']);
    }
  }

  onResetSupermarket(): void {
    this.cartService.cartItems.next([]);
    this.marketService.deleteSupermarket();
  }

  onClearError(): void {
    this.error = null;
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
