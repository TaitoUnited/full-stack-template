/**
 * Converts field names into a unified format whether
 * it was read from Filter class property or given as parameter
 * from the GraphQL API.
 *
 * Additional "ref_" prefix is removed if it exists, and '_' is
 * converted into '.'. For example:
 *
 *   ref_product_brandName -> product.brandName
 *   product_brandName     -> product.brandName
 *   product.brandName     -> product.brandName
 */
export function formatFieldName(fieldName: string) {
  return fieldName.replace(/^ref_/, '').replace(/_/g, '.');
}

/**
 * Converts keys of an object into a unified field name format.
 *
 * Additional "ref_" prefix is removed if it exists, and '_' is
 * converted into '.'. For example:
 *
 *   ref_product_brandName -> product.brandName
 *   product_brandName     -> product.brandName
 *   product.brandName     -> product.brandName
 */
export function getObjectKeysAsFieldNames(obj: any) {
  return Object.getOwnPropertyNames(obj).map((f) => formatFieldName(f));
}

/**
 * Converts camelCase to snake_case.
 *
 * If convertDepth is true, both 'assignedUser.firstName' and
 * 'ref_assignedUser_firstName' are converted to
 * 'assigned_user.first_name'.
 *
 * @param str
 * @param convertDepth
 * @param whiteSpaceAllowed
 * @returns
 */
export function toSnakeCase(
  str: string,
  convertDepth = false,
  whiteSpaceAllowed = false
) {
  if (!whiteSpaceAllowed && str && str.match(/\s+/)) {
    throw new Error('Whitespace not allowed');
  }
  return (convertDepth ? formatFieldName(str) : str)
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase();
}

export function toCamelCase(str: string) {
  return str
    .split(/(_.+?)/g)
    .map((r) => (r.match(/_/g) ? r.replace(/_/g, '').toUpperCase() : r))
    .join('');
}

export const toSnakeCaseArray = (columns: string[], convertDepth = false) => {
  return columns.map((column) => `${toSnakeCase(column, convertDepth)}`);
};

export const keysAsSnakeCaseArray = (object: any, convertDepth = false) => {
  return toSnakeCaseArray(Object.getOwnPropertyNames(object), convertDepth);
};

export function trimGaps(str: string) {
  return str.replace(/\s+/g, ' ').trim();
}

type Formatter = {
  <In, Out = any>(promise: Promise<In>): Promise<Out>;
  <In, Out = any>(arr: In[]): Out[];
  <In, Out = any>(obj: In): Out;
};

function formatter<In, Out = any>(
  formatFn: (key: string) => string,
  promise: Promise<In>
): Promise<Out>;
function formatter<In, Out = any>(
  formatFn: (key: string) => string,
  arr: In[]
): Out[];
function formatter<In, Out = any>(
  formatFn: (key: string) => string,
  obj: In
): Out;
function formatter(formatFn: (key: string) => string, obj: any): any {
  if (obj instanceof Promise) {
    return obj.then((res) => formatter(formatFn, res));
  }
  if (Array.isArray(obj)) {
    return obj.map((child) => formatter(formatFn, child)) as any;
  }
  if (!(obj instanceof Object)) {
    return obj as any;
  }
  return Object.keys(obj).reduce(
    (newObj, key) => ({
      ...newObj,
      [formatFn(key)]: formatter(formatFn, (obj as any)[key]),
    }),
    {}
  ) as any;
}

export const snakeCase: Formatter = (obj: any) => formatter(toSnakeCase, obj);

export const camelCase: Formatter = (obj: any) => formatter(toCamelCase, obj);
