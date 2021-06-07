import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {AuthResponseData, AuthService, Role} from '../auth.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {MarketService, Supermarket} from '../../shared/market.service';

@Component({
  selector: 'app-client-login',
  templateUrl: './client-login.component.html'
})
export class ClientLoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  error: string = null;
  supermarket: Supermarket = null;
  userSub: Subscription;
  marketSub: Subscription;
  isGuest = false;

  constructor(
    private authService: AuthService,
    private marketService: MarketService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe( user => {
      if (!!user) {
        if (user.role === 'GUEST') {
          this.isGuest = true;
        } else if (user.role === 'USER') {
          this.router.navigate(['/catalogue']);
        } else {
          this.router.navigate(['/management']);
        }
      }
    });
    this.supermarket = this.marketService.getSupermarket();
  }

  onResetSupermarket(): void {
    this.marketService.deleteSupermarket();
  }

  onLogin(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;

    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    if (this.isGuest) {
      authObs = this.authService.loginGuestExisting(
        email,
        password
      );
    } else {
      authObs = this.authService.login(
        email,
        password,
        Role.USER
      );
    }

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/catalogue']);
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
    this.isLoading = true;

    authObs = this.authService.loginGuest();

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/catalogue']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
  }

  onClearError(): void {
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
