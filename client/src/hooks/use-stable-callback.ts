import { useCallback, useLayoutEffect, useRef } from 'react';

export function useStableCallback<Args extends unknown[], Result>(
  handler: (...args: Args) => Result
) {
  const handlerRef = useRef(handler);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback(
    (...args: Args): Result => handlerRef.current(...args),
    []
  );
}
