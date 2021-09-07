import { t } from '@lingui/macro';

import HomePlaceholder from './HomePlaceholder';
import { loadableWithFallback } from '~utils/promise';
import { useDocumentTitle } from '~utils/routing';
import { PreloadHandler } from '~graphql';

const Home = loadableWithFallback(() => import('./Home'), <HomePlaceholder />);

export default function HomeContainer() {
  useDocumentTitle(t`Home`);

  return <Home />;
}

HomeContainer.preload = (async () => {
  Home.preload();
}) as PreloadHandler;
