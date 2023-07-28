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
      <Stack direction="row" gap="$xxsmall" align="center">
        <Icon name="languageGlobe" size={16} color="muted1" />
        <Text variant="bodySmall" color="muted1">
          {i18n.locale.toUpperCase()}
        </Text>
      </Stack>
    </Wrapper>
  );
}

const Wrapper = styled(MenuButton, {
  base: {
    padding: '$small',
    border: '1px solid',
    borderColor: '$border!',
    borderRadius: '$small!',
  },
});
