import { Component, OnInit } from '@angular/core';
import {AdminProductsService} from './admin-products.service';
import {MarketService, Supermarket} from '../shared/market.service';
import {ShopService} from '../shared/shop.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html'
})
export class ManagementComponent implements OnInit {
  supermarket: Supermarket = null;

  constructor(
    private adminProductsService: AdminProductsService,
    private marketService: MarketService) { }

  ngOnInit(): void {
    this.supermarket = this.marketService.getSupermarket();
  }

}
