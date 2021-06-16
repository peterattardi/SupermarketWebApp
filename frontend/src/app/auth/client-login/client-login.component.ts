import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {AuthResponseData, AuthService, Role} from '../auth.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {MarketService, Supermarket} from '../../shared/market.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-client-login',
  templateUrl: './client-login.component.html'
})
export class ClientLoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  hide = true;
  isChange = false;
  error: string = this.authService.error.value;
  supermarket: Supermarket = this.marketService.supermarket.value;
  userSub: Subscription;
  isGuest = false;

  constructor(
    private authService: AuthService,
    private marketService: MarketService,
    private router: Router,
    private snackBar: MatSnackBar
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
    if (this.error) {
      this.openSnackBar(this.error, 'Ok');
    }
  }

  openSnackBar(message: string, action: string): void {
    const snackBarRef = this.snackBar.open(message, action);
    snackBarRef.afterDismissed()
      .pipe(take(1))
      .subscribe(
        res => { this.error = null; }
      );
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
        this.isLoading = false;
        if (errorMessage === 'Session expired') {
          this.authService.logout();
        }
        this.openSnackBar(errorMessage, 'Ok');
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
        this.openSnackBar(errorMessage, 'Ok');
        this.isLoading = false;
      }
    );
  }

  onChange(value: boolean): void {
    this.isChange = value;
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
