import {Component, Input, OnInit} from '@angular/core';
import {AccountInfo} from '../user-info.model';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.css']
})
export class ClientInfoComponent implements OnInit {
  @Input() user: AccountInfo;

  constructor() { }

  ngOnInit(): void {
  }

}
