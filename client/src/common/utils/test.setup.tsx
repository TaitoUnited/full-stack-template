import React from 'react';
import { cleanup } from 'react-testing-library';

import 'jest-dom/extend-expect';

// Mock translation component since we don't care about translation in tests
jest.mock('@lingui/macro', () => {
  const Trans = (props: any) => <span>{props.children}</span>;
  return { Trans };
});

afterEach(cleanup);
