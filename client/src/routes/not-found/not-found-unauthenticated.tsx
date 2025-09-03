import { Trans, useLingui } from '@lingui/react/macro';

import { DocumentTitle } from '~/components/common/document-title';
import { Link } from '~/components/navigation/link';
import { Stack } from '~/uikit/stack';
import { Text } from '~/uikit/text';

export function NotFoundUnauthenticated() {
  const { t } = useLingui();

  return (
    <>
      <DocumentTitle title={t`Page not found`} />

      <Stack direction="column" gap="$medium">
        <Text variant="headingXl">
          <Trans>404</Trans>
        </Text>

        <Text variant="leadBold">
          <Trans>Page not found</Trans>
        </Text>

        <Link to="/login">Go to login</Link>
      </Stack>
    </>
  );
}
