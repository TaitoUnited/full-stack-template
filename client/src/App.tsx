import { useInitMessages } from '~services/i18n';
import Providers from './Providers';
import Routes from './routes';

export default function App() {
  useInitMessages();

  return (
    <Providers>
      <Routes />
    </Providers>
  );
}
