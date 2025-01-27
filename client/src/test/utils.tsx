/* eslint-disable import/export */
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { cleanup, render, type RenderOptions } from '@testing-library/react';
import { type ReactElement } from 'react';
import { afterEach } from 'vitest';

import { storage } from '~/utils/storage';

afterEach(() => {
  cleanup();
});

const locale = storage.get('locale') || 'en';
i18n.load(locale, {});
i18n.activate(locale);

function WithProviders({ children }: { children: React.ReactNode }) {
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
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
