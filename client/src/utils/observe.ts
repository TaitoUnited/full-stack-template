import { useEffect, useState } from 'react';
import { usePreviousDistinct } from 'react-use';
import { debounce } from 'lodash';

import { useEffectEvent } from './memo';

export function useWindowFocus() {
  const [focused, setFocused] = useState(true);

  useEffect(() => {
    function onFocus() {
      setFocused(
        [undefined, 'visible', 'prerender'].includes(document.visibilityState)
      );
    }

    window.addEventListener('visibilitychange', onFocus, false);
    window.addEventListener('focus', onFocus, false);

    return () => {
      window.removeEventListener('visibilitychange', onFocus);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  return focused;
}

// Debounce handler in case the user eg. changes tabs quickly
const windowFocusEffectHandler = debounce(cb => cb && cb(), 5000, {
  leading: true,
  trailing: false,
});

export function useWindowFocusEffect(cb: () => any) {
  const focused = useWindowFocus();
  const prevFocused = usePreviousDistinct(focused);

  useEffect(() => {
    if (prevFocused === undefined) return;
    if (focused && !prevFocused) windowFocusEffectHandler(cb);
  }, [focused, prevFocused, cb]);
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
