import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {CartComponent} from './cart.component';
import {UserGuard} from '../catalogue/user.guard';
import {MarketGuard} from '../auth/market-guard.service';
import { CartItemComponent } from './cart-item/cart-item.component';
import {CatalogueResolver} from '../catalogue/catalogue-resolver.service';
import {CartResolver} from './cart-resolver.service';

@NgModule({
  declarations: [
    CartComponent,
    CartItemComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: CartComponent,
      canActivate: [UserGuard, MarketGuard],
      resolve: [CatalogueResolver, CartResolver]
    }])
  ],
  exports: [CartComponent]
})
export class CartModule {}
