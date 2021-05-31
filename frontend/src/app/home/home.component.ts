import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService, Role} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  role = 'Client';
  userSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe( user => {
      if (user.role === Role.ADMIN) {
        this.role = 'Admin';
      } else if (user.role === Role.USER) {
        this.role = 'Client';
      } else {
        this.role = 'Error while processing user';
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
