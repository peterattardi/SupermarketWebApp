import {Component, OnDestroy, OnInit} from '@angular/core';
import {AdminProductsService} from './admin-products.service';
import {MarketService, Supermarket} from '../shared/market.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html'
})
export class ManagementComponent implements OnInit, OnDestroy {
  supermarket: Supermarket = this.marketService.supermarket.value;
  marketSub: Subscription;

  constructor(
    private adminProductsService: AdminProductsService,
    private marketService: MarketService) { }

  ngOnInit(): void {
    this.marketSub = this.marketService.supermarket.subscribe(
      supermarket => {
        this.supermarket = supermarket;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.marketSub) {
      this.marketSub.unsubscribe();
    }
  }

}
