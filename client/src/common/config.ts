type APP_ENV = 'local' | 'feat' | 'dev' | 'test' | 'stag' | 'canary' | 'prod';

const envs = ['localhost', 'feat', 'dev', 'test', 'stag', 'canary', 'prod'];
const subdomainSplit = window.location.hostname.split('.')[0].split('-');
const envSuffix = subdomainSplit[subdomainSplit.length - 1];
const currentEnv = envs.includes(envSuffix) ? envSuffix : 'prod';

const config = {
  ENV: currentEnv as APP_ENV,
  IS_DEV: process.env.NODE_ENV !== 'production',
  API_URL: process.env.API_URL as string,
  SENTRY_PUBLIC_DSN: process.env.SENTRY_PUBLIC_DSN as string,
  ERROR_REPORTING_ENABLED:
    currentEnv === 'prod' &&
    process.env.NODE_ENV === 'production' &&
    !!process.env.SENTRY_PUBLIC_DSN &&
    process.env.SENTRY_PUBLIC_DSN.startsWith('https'),
};

export default config;
