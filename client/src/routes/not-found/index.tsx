import { Trans } from '@lingui/macro';

import { Text } from '~uikit';
import { useDocumentTitle } from '~utils/routing';

export default function NotFoundPage() {
  useDocumentTitle('404');

  return (
    <Text variant="headingXl">
      <Trans>404 - Not Found</Trans>
    </Text>
  );
}
