import styled from 'styled-components';
import { t, Trans } from '@lingui/macro';

import AlertMessage from '~components/common/AlertMessage';
import { Stack, Text } from '~uikit';
import { useDocumentTitle } from '~utils/routing';

export default function ThemingPage() {
  useDocumentTitle(t`Theming`);

  return (
    <Wrapper>
      <Stack axis="y" spacing="large">
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

const Wrapper = styled.div`
  flex: 1;
`;
