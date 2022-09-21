import { CacheContainer, CacheableFunction } from '../types/cache';

/**
 * Returns a new function that caches return value of
 * the original function. The first argument of the
 * function must be of type CacheContainer.
 *
 * This is handy for caching return values of your
 * service.read(...) methods on request state so that
 * the same entity is not read multiple times during
 * the same READ-ONLY transaction.
 *
 * @param fn Function or method to be called.
 * @param instance Class instance of the given method.
 * @returns A new function with memoize capability.
 */
export function memoizeAsync<T>(
  fn: CacheableFunction<T>,
  instance: any
): CacheableFunction<T> {
  // Return a new function with memoize capability.
  return async function (container: CacheContainer, ...args: any[]) {
    const { cache } = container;
    if (!cache || !cache.data) {
      throw Error('First parameter was not a CacheContainer');
    }

    // Call function immediately if cache is disabled
    if (!cache?.enabled) return fn.apply(instance, [container, ...args]);

    // Return value from cache if it exists, otherwise call the function
    const { data } = cache;
    const functionName = `${instance.constructor?.name || instance}.${fn.name}`;
    const cacheKey = `${functionName}: ${JSON.stringify(args)}`;
    return (data[cacheKey] =
      data[cacheKey] || fn.apply(instance, [container, ...args]));
  };
}
