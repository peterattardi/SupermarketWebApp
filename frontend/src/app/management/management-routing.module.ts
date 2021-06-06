import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ManagementComponent} from './management.component';
import {AdminGuard} from './admin.guard';
import {ChooseShopComponent} from './choose-shop/choose-shop.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: ChooseShopComponent },
      { path: ':shopId', redirectTo: ':shopId/products', pathMatch: 'full'},
      {
        path: ':shopId/products',
        loadChildren: './product/product.module#ProductModule',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule {}
