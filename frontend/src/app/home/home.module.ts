import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { ChooseShopComponent } from './choose-shop/choose-shop.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import {HomeRoutingModule} from './home-routing.module';

@NgModule({
  declarations: [
    HomeComponent,
    ChooseShopComponent,
    CatalogueComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule {}
