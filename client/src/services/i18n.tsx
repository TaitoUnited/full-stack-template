import { type ReactNode } from 'react';
import { i18n } from '@lingui/core';
import { I18nProvider as LinguiProvider } from '@lingui/react';
import { I18nProvider as AriaProvider } from 'react-aria-components';
import { useLingui } from '@lingui/react/macro';
import { storage } from '~utils/storage';

export type Locale = 'fi' | 'en';

export const SUPPORTED_LOCALES: Locale[] = ['fi', 'en'];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_LABEL: { [locale in Locale]: string } = {
  en: 'English',
  fi: 'Suomi',
};

async function loadMessages(locale: Locale) {
  // @vite-ignore
  const { messages } = await import(`../locales/${locale}/messages.po`); // Vite cannot analyze dynamic imports
  return messages;
}

export async function setupMessages() {
  const persistedLocale = storage.get('@app/locale');

  const locale: Locale = SUPPORTED_LOCALES.includes(persistedLocale)
    ? persistedLocale
    : DEFAULT_LOCALE;

  const messages = await loadMessages(locale);

  i18n.load(locale, messages);
  i18n.activate(locale);
}

export function useI18n() {
  const { i18n } = useLingui();
  const currentLocale = i18n.locale as Locale;

  async function changeLocale(locale: Locale) {
    try {
      const newMessages = await loadMessages(locale);
      i18n.load(locale, newMessages);
      i18n.activate(locale);
      storage.set('@app/locale', locale);
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
