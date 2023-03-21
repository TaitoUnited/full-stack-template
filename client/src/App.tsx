import { initiatingMessages } from '~services/i18n';
import Providers from './Providers';
import Routes from './routes';

export default function App() {
  initiatingMessages();

  return (
    <Providers>
      <Routes />
    </Providers>
  );
}
