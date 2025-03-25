export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const isValidRegexPattern = (pattern: any) => {
  try {
    new RegExp(pattern); // Try creating a RegExp
    return true; // If no error, pattern is valid
  } catch {
    return false; // If error, pattern is invalid
  }
};

export const textToRegExp = (text: string) => {
  if (isValidRegexPattern(text)) {
    return new RegExp(text, 'i');
  }
  return new RegExp('', 'i');
};

export const divideWithPrecision = (first: number, second: number, precision: number) => {
  if (second === 0) {
    throw new Error('Division by zero is not allowed.');
  }
  const factor = Math.pow(10, precision);
  return Math.floor((factor * first) / second) / factor;
};
