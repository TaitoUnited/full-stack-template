import './preview.css';
import React from 'react';
import { themes } from '@storybook/theming';
import { Decorator, Preview } from '@storybook/react';
import { OverlayProvider } from 'react-aria';
import { ThemeProvider } from 'styled-components';
import { useDarkMode } from 'storybook-dark-mode';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';

import { theme, darkTheme } from '../src/constants/theme';

i18n.load('fi', {});
i18n.activate('fi');

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    darkMode: {
      dark: {
        ...themes.dark,
        appBg: darkTheme.colors.surface,
        appContentBg: darkTheme.colors.background,
      },
      light: {
        ...themes.light,
        appBg: theme.colors.surface,
        appContentBg: theme.colors.background,
      },
    },
  },
};

function StoryDecorator({ children }: { children: React.ReactNode }) {
  const isDarkMode = useDarkMode();

  // Fix for: https://github.com/storybookjs/storybook/issues/22029
  React.useLayoutEffect(() => {
    const backgroundColor = isDarkMode ? themes.dark.appBg : themes.light.appBg;
    document.body.style.backgroundColor = backgroundColor || 'inherit';
  }, [isDarkMode]);

  return (
    <I18nProvider i18n={i18n}>
      <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
        <OverlayProvider>{children}</OverlayProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}

export const decorators: Decorator[] = [
  Story => (
    <StoryDecorator>
      <Story />
    </StoryDecorator>
  ),
];

export default preview;
