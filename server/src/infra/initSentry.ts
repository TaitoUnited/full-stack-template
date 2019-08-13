import * as Sentry from '@sentry/node';

import config from '../common/config';
import log from '../common/log';

export default function initSentry() {
  if (config.NODE_ENV === 'development') {
    log.info('Skipping sentry init in development build');
    return;
  }
  if (!config.APP_SENTRY_DSN || !config.APP_SENTRY_DSN.startsWith('https')) {
    log.info('Skipping sentry init (DSN not set up)', {
      dsn: config.APP_SENTRY_DSN,
    });
    return;
  }

  const sentryOptions = {
    dsn: config.APP_SENTRY_DSN,
    release: config.APP_VERSION,
    environment: config.COMMON_ENV,
  };
  Sentry.init(sentryOptions);

  log.info('Sentry init done', sentryOptions);
}
