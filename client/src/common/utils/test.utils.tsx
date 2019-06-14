import React from 'react';
import { render } from '@testing-library/react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { I18nProvider } from '@lingui/react';
import { Catalogs } from '@lingui/core';
import { ThemeProvider } from 'styled-components';

import theme from '~theme';

// NOTE: we only need to add theme related providers so that certain
// UI components work properly when testing them
export const renderWithProviders = (TestableComponent: JSX.Element) => {
  const catalogs: Catalogs = { fi: { messages: {} } };
  return render(
    <I18nProvider language="fi" catalogs={catalogs}>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>{TestableComponent}</ThemeProvider>
      </MuiThemeProvider>
    </I18nProvider>
  );
};
