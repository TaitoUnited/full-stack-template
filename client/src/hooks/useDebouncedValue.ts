import { useEffect, useState } from 'react';

/**
 * Debounces a value and returns the debounced value.
 * @param value The value to debounce
 * @param delay The delay (in ms) for the value to update
 * @returns The debounced value, which will update only if the value has not been updated in the last (delay) ms
 */
export function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
