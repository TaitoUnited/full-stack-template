import { useCallback, useSyncExternalStore } from 'react';

import {
  breakpoints,
  type Breakpoint,
} from '../design-system/tokens/breakpoints';

// smDown, smUp, mdDown, mdUp, etc.
type BreakpointQuery = `${Breakpoint}Down` | `${Breakpoint}Up`;

export function useBreakpoint(query: BreakpointQuery) {
  let mediaQuery = '';

  if (query.endsWith('Down')) {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const breakpoint = query.replace('Down', '') as Breakpoint;
    // Subtract 0.02px to match Panda CSS max-width rules (e.g., max-width: 767.98px)
    // and avoid overlapping with the min-width (768px) breakpoint.
    mediaQuery = `(max-width: calc(${breakpoints[breakpoint]} - 0.02px))`;
  } else if (query.endsWith('Up')) {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const breakpoint = query.replace('Up', '') as Breakpoint;
    mediaQuery = `(min-width: ${breakpoints[breakpoint]})`;
  }

  return useMediaQuery(mediaQuery);
}

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (callback: (event: MediaQueryListEvent) => void) => {
      const matchMedia = window.matchMedia(query);

      matchMedia.addEventListener('change', callback);
      return () => {
        matchMedia.removeEventListener('change', callback);
      };
    },
    [query]
  );

  function getSnapshot() {
    return window.matchMedia(query).matches;
  }

  function getServerSnapshot() {
    return false;
  }

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
