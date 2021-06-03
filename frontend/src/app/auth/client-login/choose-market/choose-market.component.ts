import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {MarketService} from './market.service';
import {Supermarket, Position} from './market.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-choose-market',
  templateUrl: './choose-market.component.html'
})
export class ChooseMarketComponent implements OnInit {
  supermarkets: Supermarket[];
  // position: Position;
  supermarketsObs: Observable<Supermarket[]>;
  chosenMarket: Supermarket = null;

  // mock
  position = new Position('12.303030', '14.302030');

  constructor(
    private marketService: MarketService
  ) { }

  ngOnInit(): void {
    this.supermarketsObs = this.marketService.getSupermarkets(this.position);
    this.supermarketsObs.subscribe( resData => {
      this.supermarkets = resData;
    });
  }

  onSelect(supermarket: Supermarket): void {
    this.chosenMarket = supermarket;
  }

  onChooseSupermarket(): void {
    this.marketService.supermarket.next(this.chosenMarket.supermarketName);
  }

}
