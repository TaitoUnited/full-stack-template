/**
 * Make all fields of an object non-nullable
 */
export type NonNullableFields<T, K extends keyof T = keyof T> = Omit<T, K> & {
  [P in K]: NonNullable<T[P]>;
};

/**
 * Make a specific field of an object non-nullable
 */
export type NonNullableField<T, K extends keyof T> = T &
  NonNullableFields<Pick<T, K>>;
