/* eslint-disable */

// NOTE: if some lib is missing type definitions you can add them here

// NOTE: however if your are extending existing types put the extensions in
// a separate file like in `styled.d.ts`!

declare module '*.png';
declare module '*.svg';
declare module '*.jpg';

declare module 'workbox-window' {
  export const Workbox: any;
}
