import { useEffect, useState } from 'react';

type WindowDimensions = {
  innerWidth: number;
  innerHeight: number;
  outerWidth: number;
  outerHeight: number;
};

/**
 * Hook for subscribing to window dimensions.
 * TODO: add debounce if needed
 */
export function useWindowSize() {
  const [dimensions, setDimensions] = useState<WindowDimensions>({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight,
  });

  useEffect(() => {
    const handler = () => {
      setDimensions({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
      });
    };

    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return dimensions;
}
