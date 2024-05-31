import { useCallback, useLayoutEffect, useRef } from 'react';

// Userland version of upcoming official `useEffectEvent` React hook:
// RFC: https://github.com/reactjs/rfcs/blob/useEffectEvent/text/0000-useEffectEvent.md
export function useEffectEvent<T extends (...args: any[]) => any>(handler: T) {
  const handlerRef = useRef<T>();

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args: any[]) => {
    const fn = handlerRef.current;
    return fn?.(...args);
  }, []);
}
