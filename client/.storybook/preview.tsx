import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { useLingui } from '@lingui/react/macro';
import { type Preview } from '@storybook/react';
import type { NotFoundRouteProps } from '@tanstack/react-router';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterContextProvider,
  useRouter,
  useRouterState,
} from '@tanstack/react-router';
import React, { createContext, type ReactNode, useContext } from 'react';
import { OverlayProvider } from 'react-aria';
import {
  I18nProvider as AriaI18nProvider,
  RouterProvider as ReactAriaRouterProvider,
} from 'react-aria-components';
import './preview.css';

i18n.load('fi', {});
i18n.activate('fi');

function RenderStory() {
  const storyFn = useContext(CurrentStoryContext);
  if (!storyFn) {
    throw new Error('Storybook root not found');
  }
  return storyFn();
}

export const CurrentStoryContext = createContext<(() => ReactNode) | undefined>(
  undefined
);

function NotFoundComponent(_props: NotFoundRouteProps) {
  const state = useRouterState();
  return (
    <div>
      <i>Warning:</i> Simulated route not found for path
      <code>{state.location.href}</code>
    </div>
  );
}

const storyPath = '/__story__';
const storyRoute = createRoute({
  path: storyPath,
  getParentRoute: () => rootRoute,
  component: RenderStory,
});

const rootRoute = createRootRoute({
  notFoundComponent: NotFoundComponent,
});
rootRoute.addChildren([storyRoute]);

export const storyRouter = createRouter({
  history: createMemoryHistory({ initialEntries: [storyPath] }),
  routeTree: rootRoute,
});

function StoryDecorator({ children }: { children: ReactNode }) {
  return (
    <RouterContextProvider router={storyRouter}>
      <AriaRouterProvider>
        <I18nProvider i18n={i18n}>
          <AriaLocaleProvider>
            <OverlayProvider>{children}</OverlayProvider>
          </AriaLocaleProvider>
        </I18nProvider>
      </AriaRouterProvider>
    </RouterContextProvider>
  );
}

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [
    Story => (
      <StoryDecorator>
        <Story />
      </StoryDecorator>
    ),
  ],
};

function AriaRouterProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <ReactAriaRouterProvider
      navigate={to => router.navigate({ to })}
      useHref={to => router.buildLocation({ to }).href}
    >
      {children}
    </ReactAriaRouterProvider>
  );
}

function AriaLocaleProvider({ children }: { children: ReactNode }) {
  const { i18n } = useLingui();
  return <AriaI18nProvider locale={i18n.locale}>{children}</AriaI18nProvider>;
}

export default preview;
