import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {OrdersComponent} from './orders.component';
import {OrdersResolver} from './orders-resolver.service';
import {MarketGuard} from '../auth/market-guard.service';
import {UserGuard} from '../catalogue/user.guard';
import {OrdersListComponent} from './orders-list/orders-list.component';
import {OrdersDetailComponent} from './order-detail/orders-detail.component';
import {CatalogueResolver} from '../catalogue/catalogue-resolver.service';
import {LoggedGuard} from '../account/logged.guard';
import {OrderGuard} from './order.guard';
import {OrderResolver} from './order-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    canActivate: [MarketGuard, UserGuard, LoggedGuard],
    resolve: [OrdersResolver],
    children: [
      {
        path: '', component: OrdersListComponent
      },
      {
        path: ':orderId',
        component: OrdersDetailComponent,
        resolve: [CatalogueResolver, OrdersResolver],
        canActivate: [OrderGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule {}
