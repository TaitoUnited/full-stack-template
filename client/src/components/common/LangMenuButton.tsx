import { t } from '@lingui/macro';

import { styled } from '~styled-system/jsx';
import { useI18n, Locale, LOCALE_LABEL } from '~services/i18n';
import { MenuButton, Stack, Text, Icon } from '~uikit';

export default function LangMenuButton() {
  const { i18n, changeLocale } = useI18n();

  return (
    <Wrapper
      label={t`Change locale`}
      onAction={(locale: Locale) => changeLocale(locale)}
      actions={Object.keys(LOCALE_LABEL).map((locale: Locale) => ({
        action: locale,
        label: LOCALE_LABEL[locale],
      }))}
    >
      <Stack direction="row" gap="$xxs" align="center">
        <Icon name="globe" size={16} color="neutral1" />
        <Text variant="bodySmall" color="neutral1">
          {i18n.locale.toUpperCase()}
        </Text>
      </Stack>
    </Wrapper>
  );
}

const Wrapper = styled(MenuButton, {
  base: {
    padding: '$small',
    borderWidth: '1px',
    borderColor: '$line3!',
    borderRadius: '$small!',
  },
});
