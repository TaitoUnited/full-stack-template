export function truncate(str: string, len: number) {
  if (str.length > len) return `${str.substring(0, len - 3)}…`;
  return str;
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
