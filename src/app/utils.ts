export const formatCardNumber = (cardNumber: number) => {
  const format = 'XXXX XXXX XXXX XXXX';
  if (!cardNumber) {
    return format;
  } else {
    return cardNumber
      .toString()
      .replace(/\s+/g, '')
      .replace(/[^0-9]/gi, '')
      .padEnd(16, 'X')
      .match(/.{1,4}/g)
      .join(' ');
  }
};

export const formatExpiryDate = (str: number) => {
  const format = 'XX/XX';
  if (!str) {
    return format;
  } else {
    return str.toString().replace(/\s+/g, '').padEnd(5, 'X');
  }
};

export const formatCVV = (str: number) => {
  const format = 'XXX';
  if (!str) {
    return format;
  } else {
    return str.toString().replace(/\s+/g, '').padEnd(3, 'X');
  }
};
