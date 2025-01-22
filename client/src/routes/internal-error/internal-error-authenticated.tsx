import { Trans } from '@lingui/react/macro';

import { useDocumentTitle } from '~hooks/use-document-title';
import { styled } from '~styled-system/jsx';
import { Stack } from '~uikit/stack';
import { Text } from '~uikit/text';

export function InternalErrorAuthenticated() {
  useDocumentTitle('Internal error');

  return (
    <Wrapper>
      <Stack direction="column" gap="medium">
        <Text variant="headingXl" align="center">
          <Trans>Something went wrong</Trans>
        </Text>

        <Text variant="bodyLarge" align="center">
          <Trans>Please try to refresh the page</Trans>
        </Text>
      </Stack>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
