import { i18n, type Messages } from '@lingui/core';
import { I18nProvider as LinguiProvider } from '@lingui/react';
import { useLingui } from '@lingui/react/macro';
import { type ReactNode } from 'react';
import { I18nProvider as AriaProvider } from 'react-aria-components';
import { z } from 'zod';

import { storage } from '~/utils/storage';

export const LOCALE_SCHEMA = z.enum(['fi', 'en-FI']);
export type Locale = z.infer<typeof LOCALE_SCHEMA>;

export const SUPPORTED_LOCALES = LOCALE_SCHEMA.options;
export const DEFAULT_LOCALE: Locale = 'en-FI';
export const LOCALE_LABEL: { [locale in Locale]: string } = {
  'en-FI': 'English',
  fi: 'Suomi',
};

// oxlint-disable
async function loadMessages(locale: Locale): Promise<Messages> {
  // @vite-ignore
  const { messages } = await import(`../locales/${locale}/messages.po`);
  return messages;
}
// oxlint-enable

export async function setupMessages() {
  const locale = storage.get('locale', LOCALE_SCHEMA) ?? DEFAULT_LOCALE;

  const messages = await loadMessages(locale);

  i18n.load(locale, messages);
  i18n.activate(locale);
}

export function useI18n() {
  const { i18n: i18nInstance } = useLingui();
  const parsedLocale = LOCALE_SCHEMA.safeParse(i18nInstance.locale);
  const currentLocale = parsedLocale.success
    ? parsedLocale.data
    : DEFAULT_LOCALE;

  async function changeLocale(locale: Locale) {
    try {
      const newMessages = await loadMessages(locale);
      i18nInstance.load(locale, newMessages);
      i18nInstance.activate(locale);
      storage.set('locale', locale);
    } catch (error) {
      console.log(`> Failed to load messages for locale: ${locale}`, error);
    }
  }

  return {
    locale: currentLocale,
    changeLocale,
  };
}

export function I18nProvider({ children }: { children: ReactNode }) {
  return (
    <LinguiProvider i18n={i18n}>
      <AriaProvider locale={i18n.locale}>{children}</AriaProvider>
    </LinguiProvider>
  );
}
