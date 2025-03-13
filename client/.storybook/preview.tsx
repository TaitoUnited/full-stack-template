import { i18n } from '@lingui/core';
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
import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
} from 'react';
import { OverlayProvider } from 'react-aria';
import {
  I18nProvider as AriaI18nProvider,
  RouterProvider as ReactAriaRouterProvider,
} from 'react-aria-components';
import { type Globals } from 'storybook/internal/types';
import './preview.css';

import { I18nProvider, type Locale, useI18n } from '../src/services/i18n';

i18n.load('en', {});
i18n.activate('en');

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

function LocaleProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  const { changeLocale } = useI18n();

  useEffect(() => {
    changeLocale(locale);
  }, [locale]);

  return <>{children}</>;
}

function StoryDecorator({
  children,
  globals,
}: {
  children: ReactNode;
  globals: Globals;
}) {
  const { locale } = globals;

  return (
    <RouterContextProvider router={storyRouter}>
      <AriaRouterProvider>
        <I18nProvider>
          <LocaleProvider locale={locale}>
            <AriaLocaleProvider>
              <OverlayProvider>{children}</OverlayProvider>
            </AriaLocaleProvider>
          </LocaleProvider>
        </I18nProvider>
      </AriaRouterProvider>
    </RouterContextProvider>
  );
}

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', title: 'English' },
        { value: 'fi', title: 'Finnish' },
      ],
      showName: true,
    },
  },
};

const preview: Preview = {
  tags: ['autodocs'],
  globalTypes,
  decorators: [
    (Story, context) => {
      return (
        <StoryDecorator globals={context.globals}>
          <Story />
        </StoryDecorator>
      );
    },
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
