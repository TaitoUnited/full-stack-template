import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

type ParseConfig = Record<
  string,
  | { type: 'string'; defaultValue?: string }
  | { type: 'number'; defaultValue?: number }
  | { parse: (value: URLSearchParams) => unknown }
>;

/**
 * A utility hook to parse and type URL search params based on a configuration
 * object. This hook is useful when you want to access URL search params in a
 * typesafe way and with proper parsing and type casting.
 *
 * @example
 * ```tsx
 * const { parsedParams } = useParsedSearchParams({
 *   page: { type: "number", defaultValue: 1 },
 *   search: { type: "string", defaultValue: "" },
 *   order: { type: "string", defaultValue: "asc" },
 *   sort: { type: "string" }, // You can omit default value
 *   selected: { parse: (p) => new Set(p.getAll("selected").map(Number)) },
 * });
 * ```
 */
export function useParsedSearchParams<T extends ParseConfig>(config: T) {
  const [searchParams, setSearchParams] = useSearchParams();

  return useMemo(() => {
    const parsed: Record<string, any> = {};

    for (const [key, options] of Object.entries(config)) {
      if ('parse' in options) {
        parsed[key] = options.parse(searchParams);
        continue;
      }

      const value = searchParams.get(key);
      const { type, defaultValue } = options;

      if (value !== null) {
        if (type === 'number') {
          const numValue = Number(value);
          parsed[key] = isNaN(numValue) ? defaultValue : numValue;
        } else {
          parsed[key] = value;
        }
      } else {
        parsed[key] = defaultValue;
      }
    }

    /**
     * Typing this without casting is impossible...
     *
     * You can basically read the following `extends` clauses as if they were
     * if-else statements:
     *
     * A extends B ? C : D
     *
     * is equivalent to:
     *
     * if (A has the shape of B)
     *  then use type C
     *  else use type D
     */
    const parsedParams = parsed as {
      // 1. Handle custom `parse` fn based configs
      [K in keyof T]: T[K] extends {
        parse: (value: URLSearchParams) => infer P;
      }
        ? P
        : // 3. Handle `string` and `number` based configs
          T[K] extends {
              type: infer TType extends 'number' | 'string';
              defaultValue?: infer TDefault;
            }
          ? // 3b. Handle the case where the `defaultValue` is `undefined`
            undefined extends TDefault
            ? TType extends 'number'
              ? number | undefined
              : string | undefined
            : // 4. Get the type based on the `defaultValue` type
              TDefault
          : never; // 5. Dissallow all other types
    };

    return {
      parsedParams,
      setSearchParams,
    };
    // The `config` object is not expected to change during the component lifecycle
  }, [searchParams]);
}
