import { Trans } from '@lingui/macro';

import { Text } from '~uikit';
import { useDocumentTitle } from '~utils/routing';

export default function NotFoundAuthenticatedPage() {
  useDocumentTitle('404');

  return (
    <Text variant="title1">
      <Trans>404 - Not Found (authenticated)</Trans>
    </Text>
  );
}
