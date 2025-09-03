import { Trans, useLingui } from '@lingui/react/macro';

import { DocumentTitle } from '~/components/common/document-title';
import { styled } from '~/styled-system/jsx';
import { Stack } from '~/uikit/stack';
import { Text } from '~/uikit/text';

export function InternalErrorUnauthenticated() {
  const { t } = useLingui();

  return (
    <>
      <DocumentTitle title={t`Internal error`} />

      <Wrapper>
        <Stack direction="column" gap="$medium">
          <Text variant="headingXl" align="center">
            <Trans>Something went wrong</Trans>
          </Text>

          <Text variant="bodyLarge" align="center">
            <Trans>Please try to refresh the page</Trans>
          </Text>
        </Stack>
      </Wrapper>
    </>
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
