import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute } from '@tanstack/react-router';

import { AlertMessage } from '~components/common/alert-message';
import { useDocumentTitle } from '~hooks/use-document-title';
import { styled } from '~styled-system/jsx';
import { Stack, Text } from '~uikit';

export const Route = createFileRoute('/_app/$workspaceId/theming')({
  component: ThemingRoute,
});

export default function ThemingRoute() {
  const { t } = useLingui();
  useDocumentTitle(t`Theming`);

  return (
    <Wrapper>
      <Stack direction="column" gap="large">
        <Text variant="headingXl">
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
