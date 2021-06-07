import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CatalogueDetailComponent} from './catalogue-detail/catalogue-detail.component';
import {CatalogueResolver} from './catalogue-resolver.service';
import {CatalogueComponent} from './catalogue.component';
import {CatalogueListComponent} from './catalogue-list/catalogue-list.component';
import {UserGuard} from './user.guard';
import {SupermarketGuard} from '../auth/supermarket-guard';
const routes: Routes = [
  {
    path: '',
    component: CatalogueComponent,
    canActivate: [SupermarketGuard, UserGuard],
    children: [
      { path: '', component: CatalogueListComponent },
      {
        path: ':id',
        component: CatalogueDetailComponent,
        resolve: [CatalogueResolver]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueRoutingModule {}
