import { useRef, useEffect } from 'react';

type Timer = ReturnType<typeof setTimeout>;
type AnyFunction<T> = (...args: T[]) => void;

/**
 * Debounces a function and handles the cleanup of the timer if the component unmounts.
 * @param func The original, non debounced function (You can pass any number of args to it)
 * @param delay The delay (in ms) for the function to return
 * @returns The debounced function, which will run only if the debounced function has not been called in the last (delay) ms
 */
export function useDebouncedHandler<T>(func: AnyFunction<T>, delay: number) {
  const timer = useRef<Timer>(undefined);

  useEffect(() => {
    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, []);

  const debouncedFunction = ((...args) => {
    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      func(...args);
    }, delay);
  }) as AnyFunction<T>;

  return debouncedFunction;
}
