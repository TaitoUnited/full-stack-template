// NOTE: This is just an example
export const times = (timesArg: number) => {
  return (func: (index: number) => any) => {
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

export const range = (n: number) => Array.from({ length: n }, (x, i) => i);

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const randomNumBetween = (min: number, max: number) =>
  Math.floor(Math.random() * max) + min;

export const isNumeric = (n: any) => !isNaN(parseFloat(n)) && isFinite(n);

export const truncate = (str: string, len: number) => {
  if (str.length > len) return `${str.substring(0, len - 3)}...`;
  return str;
};

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// eslint-disable-next-line
export const noop = () => {};

// eslint-disable-next-line
export const noopWithArgs = (...args: any[]) => {};

