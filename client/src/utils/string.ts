export const truncate = (str: string, len: number) => {
  if (str.length > len) return `${str.substring(0, len - 3)}...`;
  return str;
};

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
