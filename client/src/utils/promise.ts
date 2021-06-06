import loadable from '@loadable/component';

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Based on suggestion here: https://loadable-components.com/docs/delay/
export async function minDelayPromise(
  promise: Promise<any>,
  minimumDelay: number
) {
  const [value] = await Promise.all([promise, sleep(minimumDelay)]);
  return value;
}

export function loadableWithFallback<T>(
  importer: () => Promise<any>,
  fallback: JSX.Element,
  delay?: number
) {
  return loadable<T>(
    () => (delay ? minDelayPromise(importer(), delay) : importer()),
    { fallback }
  );
}
