import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule} from '@angular/router';
import {ManagementComponent} from './management.component';
import {AdminGuard} from './admin.guard';

@NgModule({
  declarations: [ManagementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: ManagementComponent,
      canActivate: [AdminGuard]
    }]),
  ]
})
export class ManagementModule {}
