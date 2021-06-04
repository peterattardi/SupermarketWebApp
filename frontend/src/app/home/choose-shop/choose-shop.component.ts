import { Component, OnInit } from '@angular/core';
import {Position} from '../../auth/choose-market/market.service';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {Shop, ShopService} from './shop.service';

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

  // mock
  position = new Position('12.303030', '14.302030');

  constructor(
    private authService: AuthService,
    private shopService: ShopService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getShops();
    this.resetShop();
  }

  getShops(): void {
    this.isLoading = true;
    this.shopsObs = this.shopService.getShops();
    this.shopsObs.subscribe( shops => {
      this.shops = shops;
      this.isLoading = false;
    });
  }

  resetShop(): void {
    this.shopService.resetShop(false);
  }

  onSelect(shop: Shop): void {
    this.chosenShop = shop;
  }

  onChooseShop(): void {
    this.shopService.chooseShop(this.chosenShop);
    this.router.navigate(['/management']);
  }
}
