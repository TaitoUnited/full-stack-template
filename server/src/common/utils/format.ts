export function toSnakeCase(str: string, whiteSpaceAllowed: boolean = false) {
  if (!whiteSpaceAllowed && str && str.match(/\s+/)) {
    throw 'Invalid whitespace';
  }
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export const toSnakeCaseArray = (columns: string[]) => {
  return columns.map((column) => `${toSnakeCase(column)}`);
};

export const keysAsSnakeCaseArray = (object: any) => {
  return toSnakeCaseArray(Object.getOwnPropertyNames(object));
};

export function trimGaps(str: string) {
  return str.replace(/\s+/g, ' ').trim();
}
