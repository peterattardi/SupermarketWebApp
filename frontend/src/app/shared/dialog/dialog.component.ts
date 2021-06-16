import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AccountInfo} from '../../account/user-info.model';

export class DialogData {
  constructor(
    public header: string,
    public message: string
  ) {}
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html'
})
export class DialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}
