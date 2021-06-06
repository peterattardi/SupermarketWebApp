import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ProductStartComponent} from './product-start/product-start.component';
import {ProductEditComponent} from './product-edit/product-edit.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {ProductsResolverService} from './products-resolver.service';
import {ProductComponent} from './product.component';
const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    children: [
      {path: '', component: ProductStartComponent},
      {path: 'new', component: ProductEditComponent},
      {
        path: ':id',
        component: ProductDetailComponent,
        resolve: [ProductsResolverService]
      },
      {
        path: ':id/edit',
        component: ProductEditComponent,
        resolve: [ProductsResolverService]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {}
