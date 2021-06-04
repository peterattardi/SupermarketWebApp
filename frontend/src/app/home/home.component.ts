import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService, Role} from '../auth/auth.service';
import {Subscription} from 'rxjs';
import {MarketService, Supermarket} from '../auth/choose-market/market.service';
import {Router} from '@angular/router';
import {User} from '../auth/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  user: User = null;
  userSub: Subscription;
  marketSub: Subscription;
  supermarket: Supermarket;

  constructor(private authService: AuthService,
              private marketService: MarketService,
              private router: Router) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
