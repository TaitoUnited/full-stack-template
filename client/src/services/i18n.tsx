import { ReactNode } from 'react';
import { en, fi } from 'make-plural';
import { i18n } from '@lingui/core';
import { I18nProvider as LinguiProvider, useLingui } from '@lingui/react';
import storage from '~utils/storage';

export type SupportedLocale = 'fi' | 'en';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['fi', 'en'];
export const DEFAULT_LOCALE: SupportedLocale = 'en';
export const LOCALE_LABEL: { [locale in SupportedLocale]: string } = {
  en: 'English',
  fi: 'Suomi',
};

async function loadMessages(locale: SupportedLocale) {
  // @vite-ignore
  const { messages } = await import(`../locales/${locale}/messages`); // Vite cannot analyze dynamic imports
  return messages;
}

export async function initMessages() {
  const persistedLocale = await storage.get('@app/locale');

  const locale: SupportedLocale = SUPPORTED_LOCALES.includes(persistedLocale)
    ? persistedLocale
    : DEFAULT_LOCALE;

  const messages = await loadMessages(locale);

  i18n.loadLocaleData({ en: { plurals: en }, fi: { plurals: fi } });
  i18n.load(locale, messages);
  i18n.activate(locale);
}

export function useI18n() {
  const lingui = useLingui();
  const currentLocale = lingui.i18n.locale as SupportedLocale;

  async function changeLocale(locale: SupportedLocale) {
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
