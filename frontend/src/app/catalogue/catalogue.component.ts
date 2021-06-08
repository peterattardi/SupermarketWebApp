import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../auth/user.model';
import {Subscription} from 'rxjs';
import {MarketService, Position, Supermarket} from '../shared/market.service';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {UserProductsService} from './user-products.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html'
})
export class CatalogueComponent implements OnInit, OnDestroy {
  user: User = null;
  userSub: Subscription;
  marketSub: Subscription;
  supermarket: Supermarket;
  error: string = null;
  position: Position;
  // mock
  // position = new Position(38.11526141722571, 13.349538343933283); // all

  constructor(private authService: AuthService,
              private marketService: MarketService,
              private router: Router,
              private userProductsService: UserProductsService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.supermarket = this.marketService.getSupermarket();
    this.position = this.marketService.getPosition();
    if (!this.supermarket || !this.position) {
      this.router.navigate(['/auth/supermarket']);
    }
    this.userProductsService.fetchProducts(this.supermarket.name).subscribe(
      products => {
        this.fetchQuantity();
      },
      errorMessage => {
        this.error = errorMessage;
      }
    );
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
