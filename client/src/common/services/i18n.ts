import { setupI18n, Catalogs } from '@lingui/core';

export type Lang = 'fi' | 'en';

/**
 * NOTE:
 * Use this if you need translated text outside of React components eg. in sagas
 */

const i18n = setupI18n();

export const updateI18n = (language: Lang, catalogs: Catalogs) => {
  i18n.load(catalogs);
  i18n.activate(language);

  // EXAMPLE: update moment locale too
  // moment.locale(language);
};

export default i18n;
