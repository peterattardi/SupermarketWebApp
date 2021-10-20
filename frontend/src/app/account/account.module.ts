import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule} from '@angular/router';
import {AccountComponent} from './account.component';
import {AuthGuard} from '../auth/auth.guard';
import { AdminInfoComponent } from './admin-info/admin-info.component';
import { ClientInfoComponent } from './client-info/client-info.component';
import {LoggedGuard} from './logged.guard';
import {SharedModule} from '../shared/shared.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AccountComponent,
    AdminInfoComponent,
    ClientInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: AccountComponent,
      canActivate: [LoggedGuard]
    }]),
    SharedModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class AccountModule {}
