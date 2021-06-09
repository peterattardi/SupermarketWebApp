import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../auth/user.model';
import {Subscription} from 'rxjs';
import {MarketService, Position, Supermarket} from '../shared/market.service';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {UserProductsService} from './user-products.service';
import {CartService} from '../cart/cart.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html'
})
export class CatalogueComponent implements OnInit, OnDestroy {
  user: User = null;
  userSub: Subscription;
  marketSub: Subscription;
  supermarket: Supermarket = this.marketService.getSupermarket();
  error: string = null;
  position: Position = this.marketService.getPosition();

  // mock
  // position = new Position(38.11526141722571, 13.349538343933283); // all

  constructor(private authService: AuthService,
              private marketService: MarketService,
              private router: Router,
              private userProductsService: UserProductsService,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    if (!this.supermarket || !this.position) {
      this.router.navigate(['/auth/supermarket']);
    }
    this.cartService.getCart(this.supermarket).pipe(take(1)).subscribe();
  }

  fetchQuantity(): void {
    this.userProductsService.fetchQuantity(this.position).subscribe(
      () => {},
      errorMessage => {
        this.error = errorMessage;
      });
  }

  onResetSupermarket(): void {
    this.marketService.deleteSupermarket();
  }

  onClearError(): void {
    this.error = null;
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
