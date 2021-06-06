import { Component, OnInit } from '@angular/core';
import {MarketService} from '../../shared/market.service';
import {Supermarket, Position} from '../../shared/market.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-choose-market',
  templateUrl: './choose-market.component.html'
})
export class ChooseMarketComponent implements OnInit {
  supermarkets: Supermarket[];
  // position: Position;
  supermarketsObs: Observable<Supermarket[]>;
  chosenMarket: Supermarket = null;
  isLoading = false;
  error: string = null;

  // mock
  // TODO: Choose a position / address in HTML
  position = new Position('38.11526141722571', '13.349538343933283'); // all
  // position = new Position('38.1320407281484', '13.281040977819067'); // deco
  constructor(
    private authService: AuthService,
    private marketService: MarketService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('supermarket') || this.authService.isAdmin()) {
      if (!localStorage.getItem('supermarket')) {
        this.authService.setAdminSupermarket();
      }
      this.router.navigate(['/home']);
    }
    this.getMarkets();
  }

  getMarkets(): void {
    this.isLoading = true;
    this.supermarketsObs = this.marketService.getSupermarkets(this.position);
    this.supermarketsObs.subscribe(
      resData => {
        this.supermarkets = resData;
        this.isLoading = false;
      },
      errorMessage => {
        this.isLoading = false;
        this.error = errorMessage;
      });
  }

  onClearError(): void {
    this.error = null;
  }

  onSelect(supermarket: Supermarket): void {
    this.chosenMarket = supermarket;
  }

  onChooseSupermarket(): void {
    this.marketService.chooseSupermarket(this.chosenMarket);
    this.router.navigate(['/auth/login']);
  }

}
