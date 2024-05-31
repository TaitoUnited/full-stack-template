import loadable from '@loadable/component';
import { RouterProvider } from 'react-router-dom';

import { router } from '~routes/router';
import { RouteSpinner } from '~routes/RouteSpinner';
import { Providers } from '~components/common/Providers';
import { config } from '~constants/config';
import { useVerifyAuth } from '~services/auth';

const FeatureFlagManager = loadable(
  () => import('~components/feature-flags/FeatureFlagManager')
);

export function App() {
  return (
    <Providers>
      <Root />
      {config.ENV !== 'prod' && <FeatureFlagManager />}
    </Providers>
  );
}

function Root() {
  useVerifyAuth();
  return <RouterProvider router={router} fallbackElement={<RouteSpinner />} />;
}
