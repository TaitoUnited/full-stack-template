import './preview.css';
import React from 'react';
import { themes } from '@storybook/theming';
import { Decorator, Preview } from '@storybook/react';
import { OverlayProvider } from 'react-aria';
import { useDarkMode } from 'storybook-dark-mode';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';

import * as colors from '../styled-system/tokens/colors';

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
        appBg: colors.dark.surface,
        appContentBg: colors.dark.background,
      },
      light: {
        ...themes.light,
        appBg: colors.light.surface,
        appContentBg: colors.light.background,
      },
    },
  },
};

function StoryDecorator({ children }: { children: React.ReactNode }) {
  const isDarkMode = useDarkMode();

  // Fix for: https://github.com/storybookjs/storybook/issues/22029
  React.useLayoutEffect(() => {
    const backgroundColor = isDarkMode ? themes.dark.appBg : themes.light.appBg;
    const currentTheme = isDarkMode ? 'dark' : 'light';
    document.body.style.backgroundColor = backgroundColor || 'inherit';
    document.documentElement.style.setProperty('color-scheme', currentTheme);
    document.documentElement.setAttribute('data-color-scheme', currentTheme);
  }, [isDarkMode]);

  return (
    <I18nProvider i18n={i18n}>
      <OverlayProvider>{children}</OverlayProvider>
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
