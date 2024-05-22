import './preview.css';
import React from 'react';
import { Decorator, Preview } from '@storybook/react';
import { OverlayProvider } from 'react-aria';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';

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
  },

  tags: ['autodocs']
};

function StoryDecorator({ children }: { children: React.ReactNode }) {
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
