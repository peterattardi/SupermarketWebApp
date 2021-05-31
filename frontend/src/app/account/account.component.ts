import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {AuthService} from '../auth/auth.service';

export interface Client {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  address: string;
  cap: string;
  enabled: boolean;
  locked: boolean;
  role: string;
}

export interface Admin {
  firstName: string;
  lastName: string;
  email: string;
  supermarketId: string;
  supermarketName: string;
  role: string;
}
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {
  error = false;
  isAdmin = false;

  userSub: Subscription;

  constructor(private authService: AuthService, private http: HttpClient) {  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe( user => {
      if (user) {
        this.isAdmin = user.role === 'ADMIN';
      } else {
        this.isAdmin = false;
        this.error = true;
      }
    });
  }

}
