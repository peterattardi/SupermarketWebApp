import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../auth/user.model';
import {Subscription} from 'rxjs';
import {MarketService, Supermarket} from '../../auth/choose-market/market.service';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit, OnDestroy {
  user: User = null;
  userSub: Subscription;
  marketSub: Subscription;
  supermarket: Supermarket;

  constructor(private authService: AuthService,
              private marketService: MarketService,
              private router: Router) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe( user => {
      this.user = user;
    });
    this.supermarket = this.marketService.getSupermarket();
    if (this.supermarket === null) {
      this.router.navigate(['/auth/supermarket']);
    }
  }

  onResetSupermarket(): void {
    this.marketService.deleteSupermarket();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
