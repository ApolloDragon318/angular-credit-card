import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-card-input',
  templateUrl: './card-input.component.html',
  styleUrls: ['./card-input.component.scss'],
})
export class CardInputComponent {
  focusOn() {
    this.focusOnEmit.emit();
  }
  focusOut() {
    this.focusOutEmit.emit();
  }

  @Input() submitHistoryFlag: Boolean;
  @Input() formGroup: FormGroup;
  @Input() errors: string;
  @Input() controlName: string;
  @Input() label: string;
  @Input() placeholder: string;
  @Output() focusOnEmit = new EventEmitter();
  @Output() focusOutEmit = new EventEmitter();
}
