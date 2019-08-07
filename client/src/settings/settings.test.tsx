import React from 'react';

import '~common/utils/test.setup';

import LangButton from './LangButton';
import { renderWithProviders } from '~common/utils/test.utils';

// NOTE: this is a stupid test! Don't make tests like this.
test('Renders with correct text content', () => {
  const onClick = jest.fn();
  const { getByText } = renderWithProviders(
    <LangButton onClick={onClick} active>
      fi
    </LangButton>
  );
  expect(getByText('fi')).toBeInTheDocument();
});
