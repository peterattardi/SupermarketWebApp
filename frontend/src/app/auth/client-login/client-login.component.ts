import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {AuthResponseData, AuthService, Role} from '../auth.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {MarketService} from './choose-market/market.service';

@Component({
  selector: 'app-client-login',
  templateUrl: './client-login.component.html',
  styleUrls: ['./client-login.component.css']
})
export class ClientLoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  error: string = null;
  supermarket: string = null;
  userSub: Subscription;
  marketSub: Subscription;

  constructor(
    private authService: AuthService,
    private marketService: MarketService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe( user => {
      if (!!user) {
        this.router.navigate(['/home']);
      }
    });
    this.marketSub = this.marketService.supermarket.subscribe( supermarket => {
      this.supermarket = supermarket;
    });
  }

  onResetSupermarket(): void {
    this.marketService.supermarket.next(null);
  }

  onLogin(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;

    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    authObs = this.authService.login(
      email,
      password,
      Role.USER
    );

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }

  onLoginGuest(): void {
    let authObs: Observable<AuthResponseData>;

    authObs = this.authService.loginGuest();

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
  }

  onHandleError(): void {
    this.error = null;
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.marketSub) {
      this.marketSub.unsubscribe();
    }
  }
}
