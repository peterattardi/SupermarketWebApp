import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {CartComponent} from './cart.component';
import {UserGuard} from '../catalogue/user.guard';
import {SupermarketGuard} from '../auth/supermarket-guard';
import { CartItemComponent } from './cart-item/cart-item.component';

@NgModule({
  declarations: [
    CartComponent,
    CartItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: CartComponent,
      canActivate: [UserGuard, SupermarketGuard]
    }]),
    SharedModule
  ]
})
export class CartModule {}
