import React from 'react';
import { render } from 'react-testing-library';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { I18nProvider } from '@lingui/react';

import theme from '~theme';
import { ThemeProvider } from '~styled';

// Mock translation component since for some reason it just does not work...
const FakeTrans = (props: any) => <span>{props.children}</span>;

jest.mock('@lingui/macro', () => {
  return {
    Trans: FakeTrans,
  };
});

// NOTE: we only need to add theme related providers so that certain
// UI components work properly when testing them
export const renderWithProviders = (TestableComponent: JSX.Element) => {
  return render(
    <I18nProvider language="fi">
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>{TestableComponent}</ThemeProvider>
      </MuiThemeProvider>
    </I18nProvider>
  );
};
