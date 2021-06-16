import {CatalogueDetailComponent} from './catalogue-detail/catalogue-detail.component';
import {NgModule} from '@angular/core';
import {CatalogueListComponent} from './catalogue-list/catalogue-list.component';
import {CatalogueItemComponent} from './catalogue-list/catalogue-item/catalogue-item.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {CatalogueRoutingModule} from './catalogue-routing.module';
import {CatalogueComponent} from './catalogue.component';
import {FormsModule} from '@angular/forms';
import { CartPreviewComponent } from './cart-preview/cart-preview.component';
import {CartComponent} from '../cart/cart.component';
import {CartModule} from '../cart/cart.module';
import {MatBadgeModule} from '@angular/material/badge';
import {CartPreviewItemComponent} from './cart-preview/cart-preview-item/cart-preview-item.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    CatalogueListComponent,
    CatalogueItemComponent,
    CatalogueDetailComponent,
    CatalogueComponent,
    CartPreviewComponent,
    CartPreviewItemComponent
  ],
  imports: [
    CommonModule,
    CatalogueRoutingModule,
    SharedModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatBadgeModule,
    MatInputModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule
  ]
})
export class CatalogueModule {}
