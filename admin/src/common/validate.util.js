export const required = value => (value ? undefined : 'Tämä kenttä vaaditaan');

export const hasLength = (arr = []) =>
  arr.length > 0 ? undefined : 'Lisää vähintään yksi';

export const maxLength = max => value =>
  value && value.length > max
    ? `Täytyy olla vähintään ${max} merkkiä pitkä`
    : undefined;

export const number = value =>
  value && isNaN(Number(value)) ? 'Täytyy olla numero' : undefined;

export const minValue = min => value =>
  value && value < min
    ? `Täytyy olla vähintään ${min} merkkiä pitkä`
    : undefined;
