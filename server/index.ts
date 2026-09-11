// This must be the first import so Sentry can instrument subsequently loaded modules.
import '~/setup/instrument';
import { log } from '~/setup/log';
import { server } from '~/setup/server';
import { setupServer } from '~/setup/setup';

setupServer(server)
  .then(() => log.info('Server setup complete'))
  .catch((error: unknown) => {
    log.error(error, 'Server setup failed');
  });
