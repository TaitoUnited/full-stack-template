import { t, Trans } from '@lingui/macro';

import AlertMessage from '~components/common/AlertMessage';
import { styled } from '~styled-system/jsx';
import { Stack, Text } from '~uikit';
import { useDocumentTitle } from '~utils/routing';

export default function ThemingPage() {
  useDocumentTitle(t`Theming`);

  return (
    <Wrapper>
      <Stack direction="column" gap="$large">
        <Text variant="title1">
          <Trans>Theming</Trans>
        </Text>

        <AlertMessage variant="info" message="Info alert message" />
        <AlertMessage variant="success" message="Success alert message" />
        <AlertMessage variant="warn" message="Warning alert message" />
        <AlertMessage variant="error" message="Error alert message" />
      </Stack>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  base: {
    flex: 1,
  },
});
