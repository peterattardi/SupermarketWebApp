import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule} from '@angular/router';
import {ManagementComponent} from './management.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {ProductsRoutingModule} from './products-routing.module';
import {ProductStartComponent} from './product-start/product-start.component';
import {ProductListComponent} from './product-list/product-list.component';
import {ProductItemComponent} from './product-list/product-item/product-item.component';
import {ProductEditComponent} from './product-edit/product-edit.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';

@NgModule({
  declarations: [
    ManagementComponent,
    ProductStartComponent,
    ProductListComponent,
    ProductItemComponent,
    ProductEditComponent,
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    SharedModule
  ]
})
export class ManagementModule {}
