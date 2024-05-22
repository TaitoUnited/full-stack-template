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

        <Checkbox label={<Text variant="bodyBold">Styled label label</Text>} />

        <Stack direction="column" gap="$small">
          <Text id="outer-label" variant="body">
            Outer label
          </Text>
          <Checkbox labelledby="outer-label" />
        </Stack>

        <Stack direction="column" gap="$small">
          <Text variant="body">(This checkbox has a hidden label)</Text>
          <Checkbox hiddenLabel="Testing" />
        </Stack>

        <Checkbox isDisabled label="I'm disabled" />

        <Checkbox isInvalid label="I'm invalid" />

        <Stack direction="column" gap="$small">
          <Checkbox isIndeterminate label="I'm not sure about myself" />
          <Stack direction="column" gap="$xs" style={{ paddingLeft: 20 }}>
            <Checkbox isSelected label="Child checkbox 1" />
            <Checkbox label="Child checkbox 2" />
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};
