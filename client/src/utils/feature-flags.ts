import config, { AppEnv, appEnvironments } from '~constants/config';

const featureConfig = {
  'feature-1': appEnvironments, // enabled in all envs
  'feature-2': ['localhost', 'dev', 'test'],
  'feature-3': [], // this feature can be enabled via query param or feature flag manager
} as const satisfies Record<string, readonly AppEnv[]>;

export type Feature = keyof typeof featureConfig;

export const features = Object.keys(
  featureConfig
) as (keyof typeof featureConfig)[];

export function isFeatureEnabled(feature: Feature) {
  return (
    // Session takes precedence over config
    isFeatureEnabledInSession(feature) || isFeatureEnabledInConfig(feature)
  );
}

export function isFeatureEnabledInConfig(feature: Feature) {
  const envs: readonly AppEnv[] = featureConfig[feature];
  return envs.includes(config.ENV);
}

export function isFeatureEnabledInSession(feature: Feature) {
  return sessionStorage.getItem(getFeatureSessionKey(feature)) === 'true';
}

export function enableFeatureInSession(feature: Feature) {
  sessionStorage.setItem(getFeatureSessionKey(feature), 'true');
}

export function disableFeatureInSession(feature: Feature) {
  sessionStorage.removeItem(getFeatureSessionKey(feature));
}

export function setupFeatureFlags() {
  const params = new URLSearchParams(document.location.search);
  const paramsFeatures = params.getAll('feature-flags') as Feature[];

  paramsFeatures
    .filter(feature => features.includes(feature))
    .forEach(feature => enableFeatureInSession(feature));
}

function getFeatureSessionKey(feature: Feature) {
  return `feature-flags/${feature}`;
}
