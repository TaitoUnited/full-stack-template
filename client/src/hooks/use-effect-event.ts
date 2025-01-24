import { useCallback, useLayoutEffect, useRef } from 'react';

// Userland version of upcoming official `useEffectEvent` React hook:
// RFC: https://react.dev/reference/react/experimental_useEffectEvent
export function useEffectEvent<T extends (...args: any[]) => any>(handler: T) {
  const handlerRef = useRef<T>(undefined);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args: any[]) => {
    const fn = handlerRef.current;
    return fn?.(...args);
  }, []);
}
