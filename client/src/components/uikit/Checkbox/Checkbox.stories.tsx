import { useState } from 'react';
import { Stack, Text, Checkbox } from '~uikit';

export default {
  title: 'Checkbox',
  component: Checkbox,
};

export const Example = () => {
  const [isChecked, setChecked] = useState(false);

  return (
    <div style={{ padding: 32 }}>
      <Stack direction="column" gap="$large">
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
