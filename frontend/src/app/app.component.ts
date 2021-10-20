import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable, Subscription} from 'rxjs';
import {map, shareReplay, take} from 'rxjs/operators';
import {ThemePalette} from '@angular/material/core';
import {Shop, ShopService} from './shared/shop.service';
import {CartService} from './cart/cart.service';
import {MarketService, Supermarket} from './shared/market.service';
import {Router} from '@angular/router';
import {AdminProductsService} from './management/admin-products.service';
import {NotificationsService} from './management/notifications/notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isGuest: boolean;
  isUser: boolean;
  supermarket: Supermarket = this.marketService.supermarket.value;
  shop: Shop = this.shopService.shop.value;
  notifications = 0;
  private userSub: Subscription;
  private fetchSub: Subscription;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  showDrawer = true;

  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];
  background: ThemePalette = undefined;

  constructor(private authService: AuthService,
              private cartService: CartService,
              private shopService: ShopService,
              private breakpointObserver: BreakpointObserver,
              private marketService: MarketService,
              private router: Router,
              private notificationsService: NotificationsService) {  }

  ngOnInit(): void {
    this.authService.autoLogin();
    this.shopService.shop.subscribe(
      shop => {
        this.shop = shop;
        if (shop) {
        }
      }
    );
    this.notificationsService.notifications.subscribe(
      notifications => {
        this.notifications = notifications;
      }
    );
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = false;
      this.isAdmin = false;
      this.isUser = false;
      this.isGuest = false;
      if (user) {
        this.isAuthenticated = true;
        if (user.role === 'ADMIN') {
          this.isAdmin = true;
        } else if (user.role === 'USER') {
          this.isUser = true;
        } else {
          this.isGuest = true;
        }
      }
    });
  }

  onToManageCatalogue(): void {
    this.router.navigate(['/management' + ( this.shop ? this.shop.shopId : '')]);
  }

  onResetSupermarket(): void {
    this.cartService.cartItems.next([]);
    this.marketService.deleteSupermarket();
  }

  onLogout(): void {
    if (this.cartService.cartItems.value.length > 0) {
      this.cartService.cartItems.next([]);
    }
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.fetchSub) {
      this.fetchSub.unsubscribe();
    }
  }
}
