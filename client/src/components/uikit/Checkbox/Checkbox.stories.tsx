import React from 'react';

import Text from '../Text';
import Checkbox from './index';
import Stack from '~components/uikit/Stack';

export default {
  title: 'Checkbox',
  component: Checkbox,
};

export const Example = () => {
  const [isChecked, setChecked] = React.useState(false);

  return (
    <div style={{ padding: 32 }}>
      <Stack axis="y" spacing="large">
        <Checkbox
          isSelected={isChecked}
          onChange={setChecked}
          label="Sluibs?"
        />

        <Checkbox label={<Text variant="bodyBold">Custom label</Text>} />

        <Checkbox isDisabled label="I'm disabled" />

        <Checkbox isIndeterminate label="I'm not sure about myself" />
      </Stack>
    </div>
  );
};
