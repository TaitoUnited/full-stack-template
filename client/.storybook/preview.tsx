import './preview.css';
import React, { type ReactNode } from 'react';
import { type Preview } from '@storybook/react';
import { I18nProvider as AriaI18nProvider } from 'react-aria-components';
import { OverlayProvider } from 'react-aria';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { useLingui } from '@lingui/react/macro';

i18n.load('fi', {});
i18n.activate('fi');

function StoryDecorator({ children }: { children: ReactNode }) {
  return (
    <I18nProvider i18n={i18n}>
      <AriaLocaleProvider>
        <OverlayProvider>{children}</OverlayProvider>
      </AriaLocaleProvider>
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

function AriaLocaleProvider({ children }: { children: ReactNode }) {
  const { i18n } = useLingui();
  return <AriaI18nProvider locale={i18n.locale}>{children}</AriaI18nProvider>;
}

export default preview;
