import { ReactNode, useEffect } from 'react';
import { en, fi } from 'make-plural';
import { i18n } from '@lingui/core';
import { I18nProvider as LinguiProvider, useLingui } from '@lingui/react';
import storage from '~utils/storage';

export type Locale = 'fi' | 'en';

const defaultLocale: Locale = 'en';

const LOCALES = ['fi', 'en'];

export async function initMessages() {
  const persistedLocale = await storage.get('@app/locale');

  const locale: Locale = LOCALES.includes(persistedLocale)
    ? persistedLocale
    : defaultLocale;

  const defaultMessages =
    locale === 'fi'
      ? (await import('../locales/fi/messages')).messages
      : (await import('../locales/en/messages')).messages;

  i18n.loadLocaleData({ en: { plurals: en }, fi: { plurals: fi } });
  i18n.load(locale, defaultMessages);
  i18n.activate(locale);
}

async function loadMessages(locale: Locale) {
  switch (locale) {
    case 'fi':
      return (await import('../locales/fi/messages')).messages;
    case 'en':
      return (await import('../locales/en/messages')).messages;
    default:
      throw Error(`Unkown locale: ${locale}`);
  }
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

export const useInitMessages = () => {
  useEffect(() => {
    const getMessages = async () => {
      await initMessages();
    };
    getMessages();
  }, []); // eslint-disable-line
};
