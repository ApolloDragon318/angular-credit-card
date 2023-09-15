import { Component, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { formatCardNumber, formatExpiryDate, formatCVV } from './utils';
import { Input, initTE } from 'tw-elements';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  cardForm: FormGroup;
  page: Number;
  payment: { id: Number };
  loading: Boolean;
  submitHistoryFlag: Boolean;
  focusedName: string;

  ngOnInit() {
    initTE({ Input });
  }

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.createForm();
    this.page = 0;
    this.loading = false;
    this.submitHistoryFlag = false;
  }

  createForm() {
    this.cardForm = this.fb.group({
      number: [
        '',
        {
          validators: [
            Validators.required,
            Validators.pattern('^[0-9]{15,16}$'),
          ],
          updateOn: 'change',
        },
      ],
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      expirationDate: [
        '',
        [
          Validators.required,
          Validators.pattern('^(0[1-9]|1[0-2]) / [0-9][0-9]$'),
        ],
      ],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      zipcode: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')],
      ],
    });
  }

  submitForm() {
    this.submitHistoryFlag = true;
    if (
      this.cardForm.controls['number'].errors === null &&
      this.cardForm.controls['firstName'].errors === null &&
      this.cardForm.controls['lastName'].errors === null &&
      this.cardForm.controls['expirationDate'].errors === null &&
      this.cardForm.controls['cvv'].errors === null &&
      this.cardForm.controls['zipcode'].errors === null
    ) {
      this.loading = true;
      const payload = {
        number: this.cardForm.value.number,
        name: `${this.cardForm.value.firstName} ${this.cardForm.value.lastName}`,
        expirationDate: this.cardForm.value.expirationDate,
        cvv: this.cardForm.value.cvv,
        zipcode: this.cardForm.value.zipcode,
      };

      this.http
        .post('https://jsonplaceholder.typicode.com/posts', payload)
        .subscribe(
          (response: any) => {
            this.page = 1;
            this.payment = response;
            this.loading = false;
            this.submitHistoryFlag = false;
          },
          (error) => {
            alert('failed');
            this.loading = false;
            this.submitHistoryFlag = false;
          }
        );
    }
  }

  focusProcess(focused: string) {
    this.focusedName = focused;
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    // card number validation
    if (event.target.id === 'card-number') {
      const initialValue = this.cardForm.value.number;
      this.cardForm.controls['number'].setValue(
        initialValue.replace(/[^0-9]*/g, '')
      );
      if (this.cardForm.controls['number'].value.length > 16) {
        this.cardForm.controls['number'].setValue(
          this.cardForm.controls['number'].value.slice(0, 16)
        );
        event.stopPropagation();
      }
      if (this.cardForm.controls['number'].value.length >= 15) {
        let value = this.cardForm.controls['number'].value
          .split('')
          .map((val) => Number(val));
        let sum: Number = value.reduce(
          (sum, val, i) =>
            i < value.length - 1
              ? i % 2 === 0
                ? sum + val
                : sum + ((val * 2) % 9) || 9
              : sum,
          0
        );
        if ((sum + value[value.length - 1]) % 10 > 0)
          this.cardForm.controls['number'].setErrors({ Luhn: 'Luhn error' });
      }
      if (initialValue !== this.cardForm.value.number) {
        event.stopPropagation();
      }
    }
    // expiration format and validation
    if (event.target.id === 'expiration-date') {
      const initialValue = this.cardForm.value.expirationDate;
      if (
        initialValue.length === 5 &&
        event.inputType === 'deleteContentBackward'
      )
        this.cardForm.controls['expirationDate'].setValue(
          initialValue.slice(0, 2)
        );
      if (initialValue.length === 2 && event.inputType === 'insertText')
        this.cardForm.controls['expirationDate'].setValue(initialValue + ' / ');
      if (this.cardForm.controls['expirationDate'].value.length > 7) {
        this.cardForm.controls['expirationDate'].setValue(
          this.cardForm.controls['expirationDate'].value.slice(0, 7)
        );
        event.stopPropagation();
      }
      if (initialValue !== this.cardForm.value.expirationDate) {
        event.stopPropagation();
      }
    }
    // cvv validation
    if (event.target.id === 'cvv') {
      const initialValue = this.cardForm.value.cvv;
      if (this.cardForm.controls['cvv'].value.length > 4) {
        this.cardForm.controls['cvv'].setValue(
          this.cardForm.controls['cvv'].value.slice(0, 4)
        );
        event.stopPropagation();
      }
      if (initialValue !== this.cardForm.value.cvv) {
        event.stopPropagation();
      }
    }
    // zipcode validation
    if (event.target.id === 'billing-zipcode') {
      const initialValue = this.cardForm.value.zipcode;
      if (
        initialValue.length === 6 &&
        event.inputType === 'deleteContentBackward'
      )
        this.cardForm.controls['zipcode'].setValue(initialValue.slice(0, 5));
      if (initialValue.length === 6 && event.inputType === 'insertText')
        this.cardForm.controls['zipcode'].setValue(
          initialValue.slice(0, 5) + '-' + initialValue.slice(5, 6)
        );
      if (this.cardForm.controls['zipcode'].value.length > 10) {
        this.cardForm.controls['zipcode'].setValue(
          this.cardForm.controls['zipcode'].value.slice(0, 10)
        );
        event.stopPropagation();
      }
      if (initialValue !== this.cardForm.value.zipcode) {
        event.stopPropagation();
      }
    }
  }

  onGoBackClciked(event) {
    this.page = 0;
  }

  get cardNumber() {
    return formatCardNumber(this.cardForm.controls['number'].value);
  }

  get cardExpirationDate() {
    return formatExpiryDate(this.cardForm.controls['expirationDate'].value);
  }

  get cardHolderFirstName() {
    return this.cardForm.controls['firstName'].value || 'Your Name';
  }

  get cardHolderLastName() {
    return this.cardForm.controls['lastName'].value;
  }

  get cardCVV() {
    return formatCVV(this.cardForm.controls['cvv'].value);
  }

  get getFocusedName() {
    return this.focusedName;
  }
}
