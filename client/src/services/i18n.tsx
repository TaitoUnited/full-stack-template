import { ReactNode } from 'react';
import { en, fi } from 'make-plural';
import { i18n } from '@lingui/core';
import { I18nProvider as LinguiProvider, useLingui } from '@lingui/react';

import { messages } from '../locales/en/messages';

export type Locale = 'fi' | 'en';

const defaultLocale: Locale = 'en';

i18n.loadLocaleData({ fi: { plurals: fi }, en: { plurals: en } });
i18n.load(defaultLocale, messages);
i18n.activate(defaultLocale);

async function loadMessages(locale: Locale) {
  switch (locale) {
    case 'en':
      return messages;
    case 'fi':
      return (await import('../locales/fi/messages')).messages;
    default:
      throw Error(`Unkown locale: ${locale}`);
  }
}

export function useI18n() {
  const lingui = useLingui();

  async function changeLocale(locale: Locale) {
    try {
      const newMessages = await loadMessages(locale);
      lingui.i18n.load(locale, newMessages);
      lingui.i18n.activate(locale);
    } catch (error) {
      console.log(`> Failed to load messages for locale: ${locale}`, error);
    }
  }

  return { i18n: lingui.i18n, changeLocale };
}

export function I18nProvider({ children }: { children: ReactNode }) {
  return <LinguiProvider i18n={i18n}>{children}</LinguiProvider>;
}
