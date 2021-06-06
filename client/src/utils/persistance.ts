import { useMemo, useState } from 'react';

import storage from './storage';
import { useUrlState } from './url';

type PersistedStateOptions = {
  urlKey: string; // if url key is give we persist the value to url too
};

export function usePersistedState<T>(
  key: Parameters<typeof storage.get>[0],
  options?: PersistedStateOptions
) {
  const [urlState, setUrlState] = useUrlState();

  const [state, setState] = useState<null | T>(() => {
    // Either get the initial value from url or localStorage
    if (options?.urlKey) {
      const value = urlState[options?.urlKey] || storage.get(key);
      if (value) setUrlState(options?.urlKey, value as any);
      return value;
    }

    return storage.get(key);
  });

  return useMemo(
    () =>
      [
        state,
        (value: T) => {
          setState(value);
          // In addition to setting the state, persist it to localStorage and url
          storage.set(key, value as any);
          if (options?.urlKey) setUrlState(options?.urlKey, value as any);
        },
      ] as const,
    [key, state, setUrlState] // eslint-disable-line react-hooks/exhaustive-deps
  );
}
