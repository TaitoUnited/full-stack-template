import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute } from '@tanstack/react-router';

import { DocumentTitle } from '~/components/common/document-title';
import { Stack } from '~/uikit/stack';
import { Text } from '~/uikit/text';

export const Route = createFileRoute('/_app/')({
  component: HomeRoute,
});

function HomeRoute() {
  const { t } = useLingui();

  return (
    <>
      <DocumentTitle title={t`Dashboard`} />

      <Stack direction="column" gap="regular">
        <Text variant="headingXl">
          <Trans>Dashboard</Trans>
        </Text>

        <Text variant="body">
          <Trans>Start building your application here.</Trans>
        </Text>
      </Stack>
    </>
  );
}
