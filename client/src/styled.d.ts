/* eslint-disable */

// NOTE: we can't put this in `custom-typings.d.ts` since for some reason it
// breaks the other declarations...
// So keep extensions to lib types in separate `d.ts` files!

// Extend styled-components default theme interface
// https://www.styled-components.com/docs/api#typescript
import 'styled-components';
import { Theme } from './constants/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
