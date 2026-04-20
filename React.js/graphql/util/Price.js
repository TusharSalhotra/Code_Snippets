export const output = (price = '', withFixed = false) => {
  if (price.toString().split('')[price.length - 1] === '.') {
    return price;
  }

  if (withFixed) {
    price /= 100;
    return price.toFixed(2);
  }

  return price / 100;
};

export const convertToCents = (dollarAmount) => {
  return Math.round(dollarAmount * 100);
};
