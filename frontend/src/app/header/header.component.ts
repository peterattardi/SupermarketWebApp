import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import {DataStorageService} from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isAdmin = false;
  isGuest = false;
  private userSub: Subscription;
  private fetchSub: Subscription;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      if (user) {
        this.isGuest = user.role === 'GUEST';
        this.isAdmin = user.role === 'ADMIN';
        this.isAuthenticated = true;
      } else {
        this.isGuest = false;
        this.isAdmin = false;
        this.isAuthenticated = false;
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.fetchSub.unsubscribe();
  }
}
