// Function to create a regular expression for matching email addresses
export const emailRegExp = (email: string) =>
  new RegExp("^" + email + "$", "i");

// Function to create a regular expression for matching a provided search expression
export const MatchRegExp = (searchExp: string) => new RegExp(searchExp, "i");

export const regexDigits = {
  number: new RegExp(/^\d*\.?\d*$/),
  phoneNumber: new RegExp(/^[0-9]{10}$/),
};
