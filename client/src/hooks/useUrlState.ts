import { useState, useMemo } from 'react';

import { getAllUrlParams, setUrlParam } from '~utils/url';

export function useUrlState() {
  const [state, setState] = useState<{ [key: string]: string }>(() =>
    getAllUrlParams()
  );

  return useMemo(
    () =>
      [
        state,
        (key: string, val: number | string) => {
          const v = val.toString();
          setUrlParam(key, v);
          setState(p => ({ ...p, [key]: v }));
        },
      ] as const,
    [state]
  );
}
