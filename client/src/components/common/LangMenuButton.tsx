import styled from 'styled-components';
import { t } from '@lingui/macro';
import { HiOutlineGlobe } from 'react-icons/hi';

import { useI18n, Locale } from '~services/i18n';
import { MenuButton, Stack, Text, Icon } from '~uikit';

export default function LangMenuButton() {
  const { i18n, changeLocale } = useI18n();

  return (
    <Wrapper
      label={t`Change locale`}
      onAction={(locale: Locale) => changeLocale(locale)}
      actions={[
        { action: 'fi', label: 'Suomi' },
        { action: 'en', label: 'English' },
      ]}
    >
      <Stack axis="x" spacing="xxsmall" align="center">
        <Icon icon={HiOutlineGlobe} size="small" color="muted1" />
        <Text variant="bodySmall" color="muted1">
          {i18n.locale.toUpperCase()}
        </Text>
      </Stack>
    </Wrapper>
  );
}

const Wrapper = styled(MenuButton)`
  width: auto;
  height: auto;
  padding: ${p => p.theme.spacing.small}px;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: ${p => p.theme.radii.small}px;
`;
