import { type NavigateOptions, type ToOptions } from '@tanstack/react-router';
import 'react-aria-components';

// https://react-spectrum.adobe.com/react-aria/routing.html#tanstack-router
declare module 'react-aria-components' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface RouterConfig {
    href: ToOptions['to'];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}
