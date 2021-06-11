import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from './shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AuthModule} from './auth/auth.module';
import {ManagementModule} from './management/management.module';
import {AccountModule} from './account/account.module';
import {CatalogueModule} from './catalogue/catalogue.module';
import {CartModule} from './cart/cart.module';
import {OrdersModule} from './orders/orders.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    AuthModule,
    CatalogueModule,
    ManagementModule,
    CartModule,
    OrdersModule,
    AccountModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


// TODO: Services optimization
// TODO: Code review
