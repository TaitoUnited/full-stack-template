import { render } from '@testing-library/react';
import { en, fi } from 'make-plural';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { ThemeProvider } from 'styled-components';

import { theme } from '~constants/theme';
import storage from './storage';

const locale = storage.get('@app/locale') || 'en';
i18n.loadLocaleData({ fi: { plurals: fi }, en: { plurals: en } });
i18n.load(locale, {});
i18n.activate(locale);

export const renderWithProviders = (TestableComponent: JSX.Element) => {
  return render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider theme={theme}>{TestableComponent}</ThemeProvider>
    </I18nProvider>
  );
};
