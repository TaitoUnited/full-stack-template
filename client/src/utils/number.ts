export function range(n: number) {
  return Array.from({ length: n }, (x, i) => i);
}

export function clamp({
  value,
  min,
  max,
}: {
  value: number;
  min: number;
  max: number;
}) {
  return Math.max(min, Math.min(max, value));
}

export function randomNumBetween({ min, max }: { min: number; max: number }) {
  return Math.floor(Math.random() * max) + min;
}

export function isNumeric(n: unknown): n is number {
  return !isNaN(parseFloat(String(n))) && isFinite(Number(n));
}
