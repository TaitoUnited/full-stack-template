import React from 'react';

import '~common/utils/test.setup';

import { renderWithProviders } from '~common/utils/test.utils';
import Orders from './index';

test('Renders with correct title', () => {
  const { getByText } = renderWithProviders(<Orders />);
  expect(getByText('Orders')).toBeInTheDocument();
});

test('Renders with correct text content', () => {
  const { getByText } = renderWithProviders(<Orders />);
  expect(getByText('Something something something')).toBeInTheDocument();
});
