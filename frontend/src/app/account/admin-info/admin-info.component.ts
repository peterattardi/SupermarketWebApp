import {Component, Input, OnInit} from '@angular/core';
import {AccountInfo} from '../user-info.model';

@Component({
  selector: 'app-admin-info',
  templateUrl: './admin-info.component.html',
  styleUrls: ['./admin-info.component.css']
})
export class AdminInfoComponent {
  @Input() admin: AccountInfo;

  constructor() { }

}
