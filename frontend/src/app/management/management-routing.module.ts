import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ManagementComponent} from './management.component';
import {AdminGuard} from './admin.guard';
import {ChooseShopComponent} from './choose-shop/choose-shop.component';
import {MarketResolver} from '../auth/market-resolver.service';
import {NotificationsComponent} from './notifications/notifications.component';
import {ManagementResolver} from './management-resolver.service';
import {ShopResolver} from '../shared/shop-resolver.service';
import {NotificationsResolver} from './notifications/notifications-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    canActivate: [AdminGuard],
    resolve: [MarketResolver],
    children: [
      { path: '', component: ChooseShopComponent },
      { path: ':shopId', redirectTo: ':shopId/products', pathMatch: 'full'},
      {
        path: ':shopId/products',
        resolve: [ShopResolver, NotificationsResolver],
        loadChildren: './product/product.module#ProductModule',
      },
      {
        path: ':shopId/notifications',
        component: NotificationsComponent,
        resolve: [ManagementResolver, ShopResolver, NotificationsResolver]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule {}
