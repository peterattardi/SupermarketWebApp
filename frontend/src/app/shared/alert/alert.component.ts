import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input() message: string;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter<void>();
  // tslint:disable-next-line:no-output-native
  @Output() success = new EventEmitter<void>();

  onCancel(): void {
    this.close.emit();
  }

  onSuccess(): void {
    this.success.emit();
  }
}
