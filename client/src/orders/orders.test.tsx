import React from 'react';
import { cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';

import { renderWithProviders } from '~common/utils/test.utils';
import Orders from './index';

afterEach(cleanup);

test('Renders with correct title', () => {
  const { getByText } = renderWithProviders(<Orders />);
  expect(getByText('Orders')).toBeDefined();
});
