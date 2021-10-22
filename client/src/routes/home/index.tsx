import { t } from '@lingui/macro';

import HomePlaceholder from './HomePlaceholder';
import { loadableWithFallback } from '~utils/promise';
import { useDocumentTitle } from '~utils/routing';
import type { PageEntry } from '~types/navigation';

const Home = loadableWithFallback(() => import('./Home'), <HomePlaceholder />);

const HomePageEntry: PageEntry = () => {
  useDocumentTitle(t`Home`);

  return <Home />;
};

HomePageEntry.preload = async () => {
  Home.preload();
};

export default HomePageEntry;
