import { Trans } from '@lingui/react/macro';
import { showReportDialog } from '@sentry/browser';

import { config } from '~/constants/config';
import { styled } from '~/styled-system/jsx';
import { Button } from '~/uikit/button';
import { Stack } from '~/uikit/stack';
import { Text } from '~/uikit/text';

export function ErrorView() {
  function tryReload() {
    window.location.reload();
  }

  return (
    <Wrapper>
      <Stack direction="column" gap="large" justify="center" align="center">
        <Text variant="headingL">
          <Trans>Something went wrong!</Trans>
        </Text>

        <Stack direction="row" gap="regular">
          {config.ERROR_REPORTING_ENABLED && (
            <Button
              variant="outlined"
              color="error"
              onPress={() => showReportDialog()}
            >
              <Trans>Report an error</Trans>
            </Button>
          )}

          <Button variant="filled" color="primary" onPress={tryReload}>
            <Trans>Reload page</Trans>
          </Button>
        </Stack>
      </Stack>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  base: {
    padding: '$medium',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '$medium',
  },
});
