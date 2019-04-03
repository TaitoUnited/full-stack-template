import React from 'react';

import '~common/utils/test.setup';

import { renderWithProviders } from '~common/utils/test.utils';
import LangButton from './LangButton';

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
