import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { DropdownDirective } from './dropdown.directive';
import {AlertComponent} from './alert/alert.component';
import { PopupComponent } from './popup/popup.component';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    DropdownDirective,
    AlertComponent,
    PopupComponent,
  ],
  imports: [CommonModule],
  exports: [
    LoadingSpinnerComponent,
    DropdownDirective,
    AlertComponent,
    PopupComponent,
    CommonModule
  ],
  entryComponents: [],
  providers: []
})
export class SharedModule {}
