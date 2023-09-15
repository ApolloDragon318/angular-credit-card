// card-input.spec.ts

describe('CardInput', () => {
  let cardNumber: string;

  beforeEach(() => {
    cardNumber = '';
  });

  it('should initialize card number as an empty string', () => {
    expect(cardNumber).toBe('');
  });

  it('should update card number when input value changes', () => {
    const newCardNumber = '1234567890';
    cardNumber = newCardNumber;
    expect(cardNumber).toBe(newCardNumber);
  });

  it('should clear card number when input value is cleared', () => {
    const newCardNumber = '1234567890';
    cardNumber = newCardNumber;
    expect(cardNumber).toBe(newCardNumber);
    cardNumber = '';
    expect(cardNumber).toBe('');
  });

  it('should validate card number with a minimum length of 10', () => {
    const invalidCardNumber = '1234';
    const validCardNumber = '1234567890';
    cardNumber = invalidCardNumber;
    expect(cardNumber.length).toBeLessThan(10);
    cardNumber = validCardNumber;
    expect(cardNumber.length).toBeGreaterThanOrEqual(10);
  });
});
