export function toSnakeCase(str: string, whiteSpaceAllowed: boolean = false) {
  if (!whiteSpaceAllowed && str && str.match(/\s+/)) {
    throw 'Invalid whitespace';
  }
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export function trimGaps(str: string) {
  return str.replace(/\s+/g, ' ').trim();
}
