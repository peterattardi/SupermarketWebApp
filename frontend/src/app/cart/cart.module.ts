import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {CartComponent} from './cart.component';
import {UserGuard} from '../catalogue/user.guard';

@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: CartComponent,
      canActivate: [UserGuard]
    }]),
    SharedModule
  ]
})
export class CartModule {}
