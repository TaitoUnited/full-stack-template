import * as Sentry from '@sentry/node';

import config from '../../common/setup/config';
import log from '../../common/setup/log';

export default function initSentry() {
  if (config.NODE_ENV === 'development') {
    log.info('Skipping sentry init in development build');
    return;
  }
  if (!config.SENTRY_DSN || !config.SENTRY_DSN.startsWith('https')) {
    log.info('Skipping sentry init (DSN not set up)', {
      dsn: config.SENTRY_DSN,
    });
    return;
  }

  const sentryOptions = {
    dsn: config.SENTRY_DSN,
    release: config.APP_VERSION,
    environment: config.COMMON_ENV,
  };
  Sentry.init(sentryOptions);

  log.info('Sentry init done', sentryOptions);
}
