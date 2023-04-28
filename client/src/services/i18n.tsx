import { ReactNode } from 'react';
import { i18n } from '@lingui/core';
import { I18nProvider as LinguiProvider, useLingui } from '@lingui/react';
import storage from '~utils/storage';

export type Locale = 'fi' | 'en';

export const SUPPORTED_LOCALES: Locale[] = ['fi', 'en'];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_LABEL: { [locale in Locale]: string } = {
  en: 'English',
  fi: 'Suomi',
};

async function loadMessages(locale: Locale) {
  // @vite-ignore
  const { messages } = await import(`../locales/${locale}/messages.ts`); // Vite cannot analyze dynamic imports
  return messages;
}

export async function initMessages() {
  const persistedLocale = storage.get('@app/locale');

  const locale: Locale = SUPPORTED_LOCALES.includes(persistedLocale)
    ? persistedLocale
    : DEFAULT_LOCALE;

  const messages = await loadMessages(locale);

  i18n.load(locale, messages);
  i18n.activate(locale);
}

export function useI18n() {
  const lingui = useLingui();
  const currentLocale = lingui.i18n.locale as Locale;

  async function changeLocale(locale: Locale) {
    try {
      const newMessages = await loadMessages(locale);
      lingui.i18n.load(locale, newMessages);
      lingui.i18n.activate(locale);
      storage.set('@app/locale', locale);
    } catch (error) {
      console.log(`> Failed to load messages for locale: ${locale}`, error);
    }
  }

  return {
    i18n: lingui.i18n,
    locale: currentLocale,
    changeLocale,
  };
}

export function I18nProvider({ children }: { children: ReactNode }) {
  return <LinguiProvider i18n={i18n}>{children}</LinguiProvider>;
}
