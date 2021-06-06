/* eslint-disable */

// NOTE: if some lib is missing type definitions you can add them here

// NOTE: however if your are extending existing types put the extensions in
// a separate file like in `styled.d.ts`!

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

declare module 'workbox-window' {
  export const Workbox: any;
}
