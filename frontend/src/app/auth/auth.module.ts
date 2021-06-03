import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthComponent } from './auth.component';
import { SharedModule } from '../shared/shared.module';
import { ClientLoginComponent } from './client-login/client-login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { RegistrationComponent } from './registration/registration.component';
import {AuthRoutingModule} from './auth-routing.module';

@NgModule({
  declarations: [
    AuthComponent,
    ClientLoginComponent,
    AdminLoginComponent,
    RegistrationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule {}
