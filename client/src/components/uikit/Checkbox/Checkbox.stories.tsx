import React from 'react';

import Stack from '../Stack';
import Text from '../Text';
import Checkbox from './index';

export default {
  title: 'Checkbox',
  component: Checkbox,
};

export const Example = () => {
  const [isChecked, setChecked] = React.useState(false);

  return (
    <div style={{ padding: 32 }}>
      <Stack as="label" axis="x" spacing="small" align="center">
        <Checkbox
          isChecked={isChecked}
          onChange={setChecked}
          labelledby="sluibs-label"
        />

        <Text variant="body" as="label" id="sluibs-label">
          Sluibs?
        </Text>
      </Stack>
    </div>
  );
};
