import React from 'react';
import { render } from 'react-testing-library';
import { MuiThemeProvider } from '@material-ui/core/styles';

import theme from '~theme';
import { ThemeProvider } from '~styled';

// NOTE: we only need to add theme related providers so that certain
// UI components work properly when testing them
export const renderWithProviders = (TestableComponent: JSX.Element) => {
  return render(
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>{TestableComponent}</ThemeProvider>
    </MuiThemeProvider>
  );
};
