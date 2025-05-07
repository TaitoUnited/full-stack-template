import { log } from './src/utils/log';
import { setupServer } from '~/setup/setup';
import { initSentry } from '~/setup/sentry';
import { server } from '~/setup/server';

// Sentry should be initialized as early as possible.
initSentry();

setupServer(server)
  .then(() => {
    log.info('Server setup complete');
  })
  .catch((error) => {
    log.error(error, 'Server setup failed');
  });
