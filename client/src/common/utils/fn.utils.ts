// NOTE: This is just an example
export const times = (timesArg: number) => {
  return (func: Function) => {
    return Array(timesArg)
      .fill('-')
      .map((_, index) => {
        return func(index);
      });
  };
};

export const scrollToBottom = () => {
  window.scrollTo(0, document.body.scrollHeight);
};

export const range = (n: number) => [...Array(n).keys()];

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const randomNumBetween = (min: number, max: number) =>
  Math.floor(Math.random() * max) + min;

export const isNumeric = (n: any) => !isNaN(parseFloat(n)) && isFinite(n);

export const truncate = (str: string, len: number) => {
  if (str.length > len) return `${str.substring(0, len - 3)}...`;
  return str;
};

// eslint-disable-next-line
export const noop = () => {};

// eslint-disable-next-line
export const noopWithArgs = (...args: any[]) => {};
