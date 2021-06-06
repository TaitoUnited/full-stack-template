import './preview.css';
import { themes } from '@storybook/theming';
import { DocsPage, DocsContainer } from '@storybook/addon-docs';
import { useDarkMode } from 'storybook-dark-mode';
import { OverlayProvider } from 'react-aria';
import { ThemeProvider } from 'styled-components';

import { theme, darkTheme } from '../src/constants/theme';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
  darkMode: {
    dark: {
      ...themes.dark,
      appBg: darkTheme.colors.surface,
      appContentBg: darkTheme.colors.background,
    },
    light: {
      ...themes.normal,
      appBg: theme.colors.surface,
      appContentBg: theme.colors.background,
    },
  },
};

export const decorators = [
  Story => (
    <ThemeProvider theme={useDarkMode() ? darkTheme : theme}>
      <OverlayProvider>
        <Story />
      </OverlayProvider>
    </ThemeProvider>
  ),
];
