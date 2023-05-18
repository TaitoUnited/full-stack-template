/* eslint-disable import/export */
import { ReactElement } from 'react';
import { RenderOptions, cleanup, render } from '@testing-library/react';
import { afterEach } from 'vitest';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { ThemeProvider } from 'styled-components';

import storage from '~utils/storage';
import { theme } from '~constants/theme';

afterEach(() => {
  cleanup();
});

const locale = storage.get('@app/locale') || 'en';
i18n.load(locale, {});
i18n.activate(locale);

function WithProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider i18n={i18n}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </I18nProvider>
  );
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: WithProviders, ...options });
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { customRender as render };
