import { t } from '@lingui/macro';

import ThemingPlaceholder from './ThemingPlaceholder';
import { loadableWithFallback } from '~utils/promise';
import { useDocumentTitle } from '~utils/routing';
import { PreloadHandler } from '~graphql';

const Theming = loadableWithFallback(
  () => import('./Theming'),
  <ThemingPlaceholder />
);

export default function ThemingContainer() {
  useDocumentTitle(t`Theming`);

  return <Theming />;
}

ThemingContainer.preload = (async () => {
  Theming.preload();
}) as PreloadHandler;
