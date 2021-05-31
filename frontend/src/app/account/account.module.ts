import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule} from '@angular/router';
import {AccountComponent} from './account.component';
import {AuthGuard} from '../auth/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { ClientComponent } from './client/client.component';

@NgModule({
  declarations: [
    AccountComponent,
    AdminComponent,
    ClientComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: AccountComponent,
      canActivate: [AuthGuard]
    }]),
  ]
})
export class AccountModule {}
