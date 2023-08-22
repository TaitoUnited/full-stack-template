import { useEffect, useState } from 'react';
import loadable from '@loadable/component';

import Providers from './Providers';
import Routes from './routes';
import config from '~constants/config';
import { initMessages } from '~services/i18n';

const FeatureFlagManager = loadable(
  () => import('~components/feature-flags/FeatureFlagManager')
);

export default function App() {
  const ready = useAppReady();
  if (!ready) return null;

  return (
    <Providers>
      <Routes />
      {config.ENV !== 'prod' && <FeatureFlagManager />}
    </Providers>
  );
}

function useAppReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      await initMessages();
      setReady(true);
    }
    init();
  }, []);

  return ready;
}
