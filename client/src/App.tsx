import Providers from './Providers';
import Routes from './routes';
import { initMessages } from '~services/i18n';
import { useEffect, useState } from 'react';

export default function App() {
  const ready = useAppReady();
  if (!ready) return null;

  return (
    <Providers>
      <Routes />
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
