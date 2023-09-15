import { Component, Input } from '@angular/core';

@Component({
  selector: 'credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss'],
})
export class CreditCardComponent {
  @Input() cardNumber: string;
  @Input() cardHolderFirstName: string;
  @Input() cardHolderLastName: string;
  @Input() cardExpirationDate: string;
  @Input() cardCVV: string;
  @Input() focusedName: string;
}
