import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit{
  @Input() message: string;
  @Input() type: string; // default is 'error': can be 'error', 'warning' or 'info'
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter<void>();

  isError = false;
  isWarning = false;
  isInfo = false;

  ngOnInit(): void {
    if (this.type === 'info') {
      this.isInfo = true;
    } else if (this.type === 'warning') {
      this.isWarning = true;
    } else {
      this.isError = true;
    }
  }

  onClose(): void {
    this.close.emit();
  }

}
