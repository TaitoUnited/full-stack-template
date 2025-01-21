import { Trans, useLingui } from '@lingui/react/macro';

import { useDocumentTitle } from '~hooks/useDocumentTitle';
import { Stack, Text } from '~uikit';

export default function FeatureFlagsRoute() {
  const { t } = useLingui();
  useDocumentTitle(t`Feature Flags`);

  return (
    <Stack direction="column" gap="large">
      <Text variant="headingXl">
        <Trans>Feature flags</Trans>
      </Text>

      <Stack direction="column" gap="regular">
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
  );
}
