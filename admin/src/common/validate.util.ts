export const required = (value: any) =>
  value ? undefined : 'Tämä kenttä vaaditaan';

export const hasLength = (arr = []) =>
  arr.length > 0 ? undefined : 'Lisää vähintään yksi';

export const maxLength = (max: string) => (value: any) =>
  value && value.length > max
    ? `Täytyy olla vähintään ${max} merkkiä pitkä`
    : undefined;

export const number = (value: any) =>
  value && isNaN(Number(value)) ? 'Täytyy olla numero' : undefined;

export const minValue = (min: number) => (value: any) =>
  value && value < min
    ? `Täytyy olla vähintään ${min} merkkiä pitkä`
    : undefined;
