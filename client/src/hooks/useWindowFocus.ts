import { useEffect, useState } from 'react';

import { useEffectEvent } from './useEffectEvent';

export function useWindowFocusState() {
  const [isFocused, setFocused] = useState(true);

  useEffect(() => {
    function handler() {
      setFocused(document.visibilityState !== 'hidden');
    }

    window.addEventListener('visibilitychange', handler, false);

    return () => {
      window.removeEventListener('visibilitychange', handler);
    };
  }, []);

  return isFocused;
}

export function useWindowFocusEffect(callback: () => void) {
  const stableCallback = useEffectEvent(callback);

  useEffect(() => {
    function handler() {
      const isFocused = document.visibilityState !== 'hidden';
      if (isFocused) stableCallback();
    }

    window.addEventListener('visibilitychange', handler, false);

    return () => {
      window.removeEventListener('visibilitychange', handler);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
