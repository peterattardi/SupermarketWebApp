import { Component, OnInit } from '@angular/core';
import {MarketService, Position, Supermarket} from '../../shared/market.service';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Shop, ShopService} from '../../shared/shop.service';
import {AdminProductsService} from '../admin-products.service';

@Component({
  selector: 'app-choose-shop',
  templateUrl: './choose-shop.component.html'
})
export class ChooseShopComponent implements OnInit {
  shops: Shop[];
  // position: Position;
  shopsObs: Observable<Shop[]>;
  chosenShop: Shop = null;
  isLoading = false;
  error: string = null;

  // mock
  position = new Position('12.303030', '14.302030');

  constructor(
    private authService: AuthService,
    private marketService: MarketService,
    private shopService: ShopService,
    private adminProductsService: AdminProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getShops();
    this.resetShop();
  }

  getShops(): void {
    this.isLoading = true;
    this.shopsObs = this.shopService.getShops();
    this.shopsObs.subscribe(
      shops => {
        this.shops = shops;
        this.isLoading = false;
      },
      errorMessage => {
        this.isLoading = false;
        this.error = errorMessage;
      });
  }

  onReloadShops(): void {
    this.getShops();
  }

  onClearError(): void {
    this.error = null;
  }

  resetShop(): void {
    this.shopService.resetShop(false);
  }

  onSelect(shop: Shop): void {
    this.chosenShop = shop;
  }

  onChooseShop(): void {
    this.shopService.chooseShop(this.chosenShop);
    this.router.navigate([this.chosenShop.shopId], {relativeTo: this.route});
  }
}
