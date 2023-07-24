import { Stack, ComboBox } from '~uikit';

export default {
  title: 'ComboBox',
  component: ComboBox,
};

export function Example() {
  const options = [
    { label: 'Cat', value: '1' },
    { label: 'Dog', value: '2' },
    { label: 'Horse', value: '3' },
    { label: 'Cow', value: '4' },
    { label: 'Horseradish', value: '5' },
  ];

  return (
    <Stack direction="column" gap="$large" style={{ maxWidth: 400 }}>
      <ComboBox label="Regular combobox" defaultItems={options} />

      <ComboBox label="Disabled combobox" defaultItems={options} isDisabled />

      <ComboBox label="Required combobox" defaultItems={options} isRequired />

      <ComboBox label="With icon" icon="faceId" defaultItems={options} />

      <ComboBox
        label="Descriptions also"
        description="You should pick the third one"
        defaultItems={options}
      />

      <ComboBox
        label="Some invalid choice"
        errorMessage="This is really bad"
        defaultItems={options}
      />
    </Stack>
  );
}
