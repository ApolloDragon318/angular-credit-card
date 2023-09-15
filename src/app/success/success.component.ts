import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent {
  goBack() {
    this.goBackEvent.emit();
  }

  @Output() goBackEvent = new EventEmitter();
  @Input() paymentID!: Number;
}
