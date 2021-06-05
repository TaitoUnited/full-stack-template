export const asSnakeCase = (str: string) => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};
