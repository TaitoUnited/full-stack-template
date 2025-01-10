import '@testing-library/jest-dom/vitest';

// Mock translation component since we don't care about translation in tests
vitest.mock('@lingui/react/macro', () => {
  function Trans(props: any) {
    return <span>{props.children}</span>;
  }

  return { Trans };
});
