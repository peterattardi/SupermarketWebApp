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
  private userSub: Subscription;
  private fetchSub: Subscription;

  constructor(
    private authService: AuthService,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      if (user) {
        this.isAdmin = user.role === 'ADMIN';
      } else {
        this.isAdmin = false;
      }
    });
  }

  onSaveData(): void {
    this.dataStorageService.storeProducts();
  }

  onFetchData(): void {
    this.fetchSub = this.dataStorageService.fetchProducts().subscribe();
  }


  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.fetchSub.unsubscribe();
  }
}
