import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule} from '@angular/router';
import {ManagementComponent} from './management.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {ManagementRoutingModule} from './management-routing.module';
import {ProductModule} from './product/product.module';
import {ChooseShopComponent} from './choose-shop/choose-shop.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    ManagementComponent,
    ChooseShopComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ManagementRoutingModule,
    SharedModule,
    ProductModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ManagementModule {}
