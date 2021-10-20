import {ProductStartComponent} from './product-start/product-start.component';
import {ProductEditComponent} from './product-edit/product-edit.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {NgModule} from '@angular/core';
import {ManagementComponent} from '../management.component';
import {ProductListComponent} from './product-list/product-list.component';
import {ProductItemComponent} from './product-list/product-item/product-item.component';
import {ProductComponent} from './product.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {ProductRoutingModule} from './product-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    ProductStartComponent,
    ProductListComponent,
    ProductItemComponent,
    ProductEditComponent,
    ProductDetailComponent,
    ProductComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    SharedModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule
  ]
})
export class ProductModule {}
