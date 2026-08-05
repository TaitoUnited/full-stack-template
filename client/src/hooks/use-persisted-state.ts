import { useMemo, useState } from 'react';
import { type ZodType } from 'zod';

import { storage } from '~/utils/storage';

type PersistedValue = string | Record<string, unknown>;

export function usePersistedState<Value extends PersistedValue>(
  key: Parameters<typeof storage.get>[0],
  schema: ZodType<Value>
) {
  const [state, setState] = useState<null | Value>(() => {
    return storage.get(key, schema);
  });

  return useMemo(
    () =>
      [
        state,
        (value: Value) => {
          setState(value);
          storage.set(key, value);
        },
      ] as const,
    [key, state]
  );
}
