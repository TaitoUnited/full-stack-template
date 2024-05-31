import { useEffect, useState } from 'react';

import { useEffectEvent } from './useEffectEvent';

export function useKeyPressState(key: string): boolean {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key === key) setPressed(true);
    };

    const upHandler = (event: KeyboardEvent) => {
      if (event.key === key) setPressed(false);
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [key]);

  return pressed;
}

export function useKeyPressEvent(
  key: string,
  handler: (event: KeyboardEvent) => void
) {
  const stableHandler = useEffectEvent(handler);

  useEffect(() => {
    const eventHandler = (event: KeyboardEvent) => {
      if (event.key === key) stableHandler(event);
    };

    window.addEventListener('keydown', eventHandler);

    return () => window.removeEventListener('keydown', eventHandler);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps -- stable handler
}
