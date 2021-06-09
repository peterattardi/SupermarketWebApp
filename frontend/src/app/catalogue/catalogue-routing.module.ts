import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CatalogueDetailComponent} from './catalogue-detail/catalogue-detail.component';
import {CatalogueResolver} from './catalogue-resolver.service';
import {CatalogueComponent} from './catalogue.component';
import {CatalogueListComponent} from './catalogue-list/catalogue-list.component';
import {UserGuard} from './user.guard';
import {SupermarketGuard} from '../auth/supermarket-guard';
import {CartResolver} from '../cart/cart-resolver.service';
const routes: Routes = [
  {
    path: '',
    component: CatalogueComponent,
    canActivate: [SupermarketGuard, UserGuard],
    resolve: [CatalogueResolver, CartResolver],
    children: [
      {
        path: '',
        component: CatalogueListComponent
      },
      {
        path: ':id',
        component: CatalogueDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueRoutingModule {}
