/* eslint-disable */
import 'react';

/**
 * NOTE: if some lib is missing type definitions you can add them here.
 * You can also extend existing type definitions.
 */

declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.webm' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module 'react' {
  // Add type support for CSS variables
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}
