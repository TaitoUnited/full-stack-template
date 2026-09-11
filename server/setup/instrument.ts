import * as Sentry from '@sentry/node';

import { config } from '~/src/utils/config';

import { log } from './log';

function initSentry() {
  if (config.NODE_ENV === 'development') {
    log.info('Skipping Sentry init in development build');
    return;
  }

  if (!config.SENTRY_DSN?.startsWith('https')) {
    log.info('Skipping Sentry init (DSN not set up)');
    return;
  }

  const sentryOptions: Sentry.NodeOptions = {
    dsn: config.SENTRY_DSN,
    environment: config.COMMON_ENV,
    release: config.APP_VERSION,
    attachStacktrace: true,
  };

  Sentry.init(sentryOptions);
  log.info(
    { environment: sentryOptions.environment, release: sentryOptions.release },
    'Sentry init done'
  );
}

initSentry();
