import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {AuthGuard} from '../auth/auth.guard';
import { ShopsComponent } from './shops/shops.component';
import { CatalogueComponent } from './catalogue/catalogue.component';

@NgModule({
  declarations: [HomeComponent, ShopsComponent, CatalogueComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: HomeComponent,
      canActivate: [AuthGuard]
    }]),
    SharedModule
  ]
})
export class HomeModule {}
