export function toSnakeCase(str: string, whiteSpaceAllowed = false) {
  if (!whiteSpaceAllowed && str && str.match(/\s+/)) {
    throw new Error('Invalid whitespace');
  }
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export function toCamelCase(str: string) {
  return str
    .split(/(_.+?)/g)
    .map((r) => (r.match(/_/g) ? r.replace(/_/g, '').toUpperCase() : r))
    .join('');
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
