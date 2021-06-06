import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home.component';
import {AuthGuard} from '../auth/auth.guard';
import {SupermarketGuard} from '../auth/supermarket-guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [SupermarketGuard, AuthGuard]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
