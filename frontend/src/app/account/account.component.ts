import { Component, OnInit } from '@angular/core';
import {AccountService} from './account.service';
import {AuthService} from '../auth/auth.service';
import {take} from 'rxjs/operators';
import {AccountInfo} from './user-info.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {
  isAdmin: boolean;
  accountInfo: AccountInfo = null;
  isLoading = true;

  constructor(private accountService: AccountService,
              private authService: AuthService,
              private snackBar: MatSnackBar) {  }

  ngOnInit(): void {
    this.accountService.getInfo()
      .pipe(take(1))
      .subscribe(
        userInfo => {
          this.isAdmin = userInfo.appUserRole === 'ADMIN';
          if (this.isAdmin) {
            this.accountInfo = new AccountInfo(
              userInfo.email,
              userInfo.appUserRole,
              userInfo.supermarketName
            );
          } else {
            this.accountInfo = new AccountInfo(
              userInfo.email,
              userInfo.appUserRole,
              userInfo.firstName,
              userInfo.lastName,
              userInfo.locked,
              userInfo.enabled,
              userInfo.address,
              userInfo.cap,
              userInfo.city,
              userInfo.supermarketName
            );
          }
          this.isLoading = false;
        },
        errorMessage => {
          if (errorMessage === 'Session expired') {
            this.authService.logout();
          } else {
            this.openSnackBar(errorMessage, 'Ok');
          }
        }
      );
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action);
  }

}
