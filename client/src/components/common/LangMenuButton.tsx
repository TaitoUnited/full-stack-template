import { t } from '@lingui/macro';

import { useI18n, SUPPORTED_LOCALES, LOCALE_LABEL } from '~services/i18n';
import { Menu, IconButton } from '~uikit';

export function LangMenuButton() {
  const { i18n, changeLocale } = useI18n();

  return (
    <Menu
      selected={new Set([i18n.locale])}
      selectionMode="single"
      trigger={<IconButton icon="globe" label={t`Change language`} />}
    >
      {SUPPORTED_LOCALES.map(locale => (
        <Menu.Item
          key={locale}
          id={locale}
          onAction={() => changeLocale(locale)}
        >
          {LOCALE_LABEL[locale]}
        </Menu.Item>
      ))}
    </Menu>
  );
}
