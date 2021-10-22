import { t } from '@lingui/macro';

import ThemingPlaceholder from './ThemingPlaceholder';
import { loadableWithFallback } from '~utils/promise';
import { useDocumentTitle } from '~utils/routing';
import type { PageEntry } from '~types/navigation';

const Theming = loadableWithFallback(
  () => import('./Theming'),
  <ThemingPlaceholder />
);

const ThemingPageEntry: PageEntry = () => {
  useDocumentTitle(t`Theming`);

  return <Theming />;
};

ThemingPageEntry.preload = async () => {
  Theming.preload();
};

export default ThemingPageEntry;
