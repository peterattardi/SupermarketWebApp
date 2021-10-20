import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownDirective } from './dropdown.directive';
import {AlertComponent} from './alert/alert.component';
import { PopupComponent } from './popup/popup.component';
import {DialogComponent} from './dialog/dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    DropdownDirective,
    AlertComponent,
    PopupComponent,
    DialogComponent
  ],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  exports: [
    DropdownDirective,
    AlertComponent,
    PopupComponent,
    DialogComponent,
    CommonModule
  ],
  entryComponents: [],
  providers: []
})
export class SharedModule {}
