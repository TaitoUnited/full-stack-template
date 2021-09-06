import { t } from '@lingui/macro';

import ThemingPlaceholder from './ThemingPlaceholder';
import { loadableWithFallback } from '~utils/promise';
import { useDocumentTitle } from '~utils/routing';

const Theming = loadableWithFallback(
  () => import('./Theming'),
  <ThemingPlaceholder />
);

export default function ThemingContainer() {
  useDocumentTitle(t`Theming`);

  return <Theming />;
}

// Preload component and data
ThemingContainer.preload = async () => {
  Theming.preload();
};
