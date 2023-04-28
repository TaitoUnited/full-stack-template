import { render } from '@testing-library/react';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { ThemeProvider } from 'styled-components';

import storage from './storage';
import { theme } from '~constants/theme';

const locale = storage.get('@app/locale') || 'en';
i18n.load(locale, {});
i18n.activate(locale);

export const renderWithProviders = (TestableComponent: JSX.Element) => {
  return render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider theme={theme}>{TestableComponent}</ThemeProvider>
    </I18nProvider>
  );
};
