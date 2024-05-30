import { useEffect, useState } from 'react';

import { useEffectEvent } from './memo';

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
/**
 * Hook to run a callback when a shortcut combination is pressed
 * @param keys Format: Meta+Shift+K etc.
 * @param callback Callback to run when keys are pressed
 */
export function useShortcut(shortcut: string, callback: () => any) {
  const stableCallback = useEffectEvent(callback);

  useEffect(() => {
    let pressedKeys: string[] = [];

    function down(e: KeyboardEvent) {
      const key = e.key.toLowerCase();

      if (!pressedKeys.includes(key)) {
        pressedKeys.push(key);
      }

      if (pressedKeys.join('+') === shortcut.toLowerCase()) {
        stableCallback();
        pressedKeys = [];
      }
    }

    function up() {
      pressedKeys = [];
    }

    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);

    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }, [shortcut]); // eslint-disable-line react-hooks/exhaustive-deps
}
