import './preview.css';
import React, { type ReactNode } from 'react';
import { type Preview } from '@storybook/react';
import { OverlayProvider } from 'react-aria';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';

i18n.load('fi', {});
i18n.activate('fi');

function StoryDecorator({ children }: { children: ReactNode }) {
  return (
    <I18nProvider i18n={i18n}>
      <OverlayProvider>{children}</OverlayProvider>
    </I18nProvider>
  );
}

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [
    Story => (
      <StoryDecorator>
        <Story />
      </StoryDecorator>
    ),
  ],
};

export default preview;
