import { useMemo, useState } from 'react';

import { storage } from '~/utils/storage';

export function usePersistedState<T>(key: Parameters<typeof storage.get>[0]) {
  const [state, setState] = useState<null | T>(() => {
    return storage.get(key);
  });

  return useMemo(
    () =>
      [
        state,
        (value: T) => {
          setState(value);
          storage.set(key, value as any);
        },
      ] as const,
    [key, state]
  );
}
