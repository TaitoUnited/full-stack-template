export const range = (n: number) => Array.from({ length: n }, (x, i) => i);

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const randomNumBetween = (min: number, max: number) =>
  Math.floor(Math.random() * max) + min;

export const isNumeric = (n: any) => !isNaN(parseFloat(n)) && isFinite(n);
