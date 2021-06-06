import { render } from '@testing-library/react';
import { en, fi } from 'make-plural';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { ThemeProvider } from 'styled-components';

import { theme } from '~constants/theme';

i18n.loadLocaleData({ fi: { plurals: fi }, en: { plurals: en } });
i18n.load('fi', {});
i18n.activate('fi');

export const renderWithProviders = (TestableComponent: JSX.Element) => {
  return render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider theme={theme}>{TestableComponent}</ThemeProvider>
    </I18nProvider>
  );
};
