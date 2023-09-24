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
  payment: { id: number };
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
    this.focusedName = '';
  }

  createForm() {
    this.cardForm = this.fb.group({
      number: this.fb.control('', {
        validators: [Validators.required, Validators.pattern('^[0-9]{15,16}$')],
        updateOn: 'change',
      }),
      firstName: this.fb.control('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$'),
      ]),
      lastName: this.fb.control('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$'),
      ]),
      expirationDate: this.fb.control('', [
        Validators.required,
        Validators.pattern('^(0[1-9]|1[0-2]) / [0-9][0-9]$'),
      ]),
      cvv: this.fb.control('', [
        Validators.required,
        Validators.pattern('^[0-9]{3,4}$'),
      ]),
      zipcode: this.fb.control('', [
        Validators.required,
        Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$'),
      ]),
    });
  }

  submitForm() {
    this.submitHistoryFlag = true;

    if (this.cardForm.valid) {
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
    if (event.target.id === 'number') {
      // Card number validation
      const numberInput = this.cardForm.controls['number'];
      const initialValue = numberInput.value;
      const sanitizedValue = initialValue.replace(/[^0-9]*/g, '');
      numberInput.setValue(sanitizedValue);

      if (sanitizedValue.length > 16) {
        numberInput.setValue(sanitizedValue.slice(0, 16));
        event.stopPropagation();
      }

      if (sanitizedValue.length >= 15) {
        const value = sanitizedValue.split('').map((val: string) => +val);
        const sum = value.reduce(
          (sum: number, val: number, i: number) =>
            i < value.length - 1
              ? i % 2 === 0
                ? sum + val
                : sum + ((val * 2) % 9) || 9
              : sum,
          0
        );

        if ((sum + value[value.length - 1]) % 10 > 0) {
          numberInput.setErrors({ Luhn: 'Luhn error' });
        }
      }

      if (initialValue !== sanitizedValue) {
        event.stopPropagation();
      }
    }

    if (event.target.id === 'expirationDate') {
      // Expiration date format and validation
      const expirationInput = this.cardForm.controls['expirationDate'];
      const initialValue = expirationInput.value;

      if (
        initialValue.length === 5 &&
        event.inputType === 'deleteContentBackward'
      ) {
        expirationInput.setValue(initialValue.slice(0, 2));
      }

      if (initialValue.length === 2 && event.inputType === 'insertText') {
        expirationInput.setValue(initialValue + ' / ');
      }

      if (expirationInput.value.length > 7) {
        expirationInput.setValue(expirationInput.value.slice(0, 7));
        event.stopPropagation();
      }

      if (initialValue !== expirationInput.value) {
        event.stopPropagation();
      }
    }

    if (event.target.id === 'cvv') {
      // CVV validation
      const cvvInput = this.cardForm.controls['cvv'];
      const initialValue = cvvInput.value;

      if (cvvInput.value.length > 4) {
        cvvInput.setValue(cvvInput.value.slice(0, 4));
        event.stopPropagation();
      }

      if (initialValue !== cvvInput.value) {
        event.stopPropagation();
      }
    }

    if (event.target.id === 'zipcode') {
      // Zip code validation
      const zipcodeInput = this.cardForm.controls['zipcode'];
      const initialValue = zipcodeInput.value;

      if (
        initialValue.length === 6 &&
        event.inputType === 'deleteContentBackward'
      ) {
        zipcodeInput.setValue(initialValue.slice(0, 5));
      }

      if (initialValue.length === 6 && event.inputType === 'insertText') {
        zipcodeInput.setValue(
          initialValue.slice(0, 5) + '-' + initialValue.slice(5, 6)
        );
      }

      if (zipcodeInput.value.length > 10) {
        zipcodeInput.setValue(zipcodeInput.value.slice(0, 10));
        event.stopPropagation();
      }

      if (initialValue !== zipcodeInput.value) {
        event.stopPropagation();
      }
    }
  }

  onGoBackClciked(_) {
    this.page = 0;
  }

  get cardNumber() {
    return formatCardNumber(this.cardForm.controls['number'].value);
  }

  get cardExpirationDate() {
    return formatExpiryDate(this.cardForm.controls['expirationDate'].value);
  }

  get cardHolderFirstName() {
    return (
      this.cardForm.controls['firstName'].value ||
      (!this.cardForm.controls['lastName'].value ? 'Your Name' : '')
    );
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
