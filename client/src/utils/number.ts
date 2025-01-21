export function range(n: number) {
  return Array.from({ length: n }, (x, i) => i);
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function randomNumBetween(min: number, max: number) {
  return Math.floor(Math.random() * max) + min;
}

export function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
