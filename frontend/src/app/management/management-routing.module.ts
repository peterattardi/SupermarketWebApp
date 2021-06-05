import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ManagementComponent} from './management.component';
import {ProductStartComponent} from './product-start/product-start.component';
import {ProductEditComponent} from './product-edit/product-edit.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {ProductsResolverService} from './products-resolver.service';
import {AdminGuard} from './admin.guard';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'products', component: ProductStartComponent},
      { path: 'products/new', component: ProductEditComponent },
      {
        path: 'products/:id',
        component: ProductDetailComponent,
        resolve: [ProductsResolverService]
      },
      {
        path: 'products/:id/edit',
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
export class ProductsRoutingModule {}
