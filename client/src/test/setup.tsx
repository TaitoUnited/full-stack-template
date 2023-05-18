import '@testing-library/jest-dom';

// Mock translation component since we don't care about translation in tests
vitest.mock('@lingui/macro', () => {
  const Trans = (props: any) => <span>{props.children}</span>;
  return { Trans };
});
