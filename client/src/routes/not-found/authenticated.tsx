import { Trans } from '@lingui/react/macro';

import { Stack, Text } from '~uikit';
import { Link } from '~components/navigation/Link';
import { useDocumentTitle } from '~hooks/useDocumentTitle';

export default function NotFoundAuthenticatedRoute() {
  useDocumentTitle('404');

  return (
    <Stack direction="column" gap="medium">
      <Text variant="headingXl">
        <Trans>404</Trans>
      </Text>

      <Text variant="leadBold">
        <Trans>Page not found</Trans>
      </Text>

      <Link to="/">Back to home</Link>
    </Stack>
  );
}
