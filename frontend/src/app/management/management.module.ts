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
    ProductModule
  ]
})
export class ManagementModule {}
