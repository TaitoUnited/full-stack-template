type APP_ENV =
  | 'local'
  | 'feat'
  | 'dev'
  | 'test'
  | 'uat'
  | 'qa'
  | 'stag'
  | 'canary'
  | 'cana'
  | 'prod';

const environments = [
  'localhost',
  'feat',
  'dev',
  'test',
  'uat',
  'qa',
  'stag',
  'canary',
  'cana',
  'prod',
];

const subdomainSplit = window.location.hostname.split('.')[0].split('-');
const envSuffix = subdomainSplit[subdomainSplit.length - 1];
const currentEnv = environments.includes(envSuffix) ? envSuffix : 'prod';

const config = {
  ENV: currentEnv as APP_ENV,
  IS_DEV: import.meta.env.DEV,
  API_URL: process.env.API_URL,
  SENTRY_DSN: process.env.SENTRY_DSN,
  ERROR_REPORTING_ENABLED:
    currentEnv === 'prod' &&
    import.meta.env.PROD &&
    !!process.env.SENTRY_DSN &&
    process.env.SENTRY_DSN.startsWith('https'),
};

export default config;
