import * as Sentry from '@sentry/node';

import { config } from '~/utils/config';
import { log } from '~/utils/log';

/**
 * Initialize Sentry for error tracking.
 *
 * Sentry should be initialized in your app as early as possible. It's essential
 * that you call Sentry.init before you require any other modules in your application,
 * otherwise, auto-instrumentation won't work for these modules.
 *
 * [Docs](https://docs.sentry.io/platforms/javascript/guides/node/#configure)
 */
export function initSentry() {
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

  const sentryOptions: Sentry.NodeOptions = {
    dsn: config.SENTRY_DSN,
    release: config.APP_VERSION,
    environment: config.COMMON_ENV,
  };

  Sentry.init(sentryOptions);

  log.info('Sentry init done', sentryOptions);
}
