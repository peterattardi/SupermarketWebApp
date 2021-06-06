import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule} from '@angular/router';
import {ManagementComponent} from './management.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {ManagementRoutingModule} from './management-routing.module';
import {ProductModule} from './product/product.module';

@NgModule({
  declarations: [
    ManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ManagementRoutingModule,
    SharedModule,
    ProductModule
  ]
})
export class ManagementModule {}
