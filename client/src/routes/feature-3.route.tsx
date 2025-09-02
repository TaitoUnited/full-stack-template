import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute } from '@tanstack/react-router';

import { DocumentTitle } from '~/components/common/document-title';
import { Stack } from '~/uikit/stack';
import { Text } from '~/uikit/text';

export const Route = createFileRoute('/_app/$workspaceId/feature-3')({
  component: Feature3Route,
});

function Feature3Route() {
  const { t } = useLingui();

  return (
    <>
      <DocumentTitle title={t`Feature Flags`} />

      <Stack direction="column" gap="$large">
        <Text variant="headingXl">
          <Trans>Feature flags</Trans>
        </Text>

        <Stack direction="column" gap="$regular">
          <Text variant="body" color="textMuted" lineHeight={1.5}>
            <Trans>
              This page is only accessible when <strong>feature-3</strong> is
              enabled in session.
            </Trans>
          </Text>

          <Text variant="body" color="textMuted" lineHeight={1.5}>
            <Trans>
              You can enable features via the feature flag manager widget.
            </Trans>
          </Text>
        </Stack>
      </Stack>
    </>
  );
}
