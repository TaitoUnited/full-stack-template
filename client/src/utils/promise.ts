import loadable from '@loadable/component';
import { useState, useEffect, useRef } from 'react';

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Based on suggestion here: https://loadable-components.com/docs/delay/
export async function minDelayPromise(
  promise: Promise<any>,
  minimumDelay: number
) {
  const [value] = await Promise.all([promise, sleep(minimumDelay)]);
  return value;
}

export function loadableWithFallback<T>(
  importer: () => Promise<any>,
  fallback: JSX.Element,
  delay?: number
) {
  return loadable<T>(
    () => (delay ? minDelayPromise(importer(), delay) : importer()),
    { fallback }
  );
}

// Baased on https://github.com/smeijer/spin-delay
export function useFallbackDelay(
  loading: boolean,
  _options?: { delay?: number; minDuration?: number }
): boolean {
  const options = { delay: 500, minDuration: 200, ..._options };
  const [state, setState] = useState<'IDLE' | 'DELAY' | 'DISPLAY' | 'EXPIRE'>(
    'IDLE'
  );
  const timeout = useRef<any>();

  useEffect(() => {
    if (loading && state === 'IDLE') {
      clearTimeout(timeout.current);

      timeout.current = setTimeout(() => {
        if (!loading) {
          return setState('IDLE');
        }

        timeout.current = setTimeout(() => {
          setState('EXPIRE');
        }, options.minDuration);

        setState('DISPLAY');
      }, options.delay);

      setState('DELAY');
    }

    if (!loading && state !== 'DISPLAY') {
      clearTimeout(timeout.current);
      setState('IDLE');
    }
  }, [loading, state, options.delay, options.minDuration]);

  useEffect(() => {
    return () => clearTimeout(timeout.current);
  }, []);

  return state === 'DISPLAY' || state === 'EXPIRE';
}
