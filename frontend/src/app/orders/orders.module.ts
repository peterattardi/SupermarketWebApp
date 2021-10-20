import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {OrdersRoutingModule} from './orders-routing.module';
import {OrdersComponent} from './orders.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrdersDetailComponent } from './order-detail/orders-detail.component';
import { OrdersItemComponent } from './orders-list/orders-item/orders-item.component';
import { OrderDetailProductComponent } from './order-detail/order-detail-product/order-detail-product.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    OrdersComponent,
    OrdersListComponent,
    OrdersDetailComponent,
    OrdersItemComponent,
    OrderDetailProductComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OrdersRoutingModule,
    SharedModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule
  ]
})
export class OrdersModule {}
