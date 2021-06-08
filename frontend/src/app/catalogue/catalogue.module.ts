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

@NgModule({
  declarations: [
    CatalogueListComponent,
    CatalogueItemComponent,
    CatalogueDetailComponent,
    CatalogueComponent
  ],
    imports: [
        CommonModule,
        CatalogueRoutingModule,
        SharedModule,
        FormsModule
    ]
})
export class CatalogueModule {}
