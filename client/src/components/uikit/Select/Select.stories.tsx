import { Stack, Select } from '~uikit';

export default {
  title: 'Select',
  component: Select,
};

export function Example() {
  const options = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
    { label: 'Option 4', value: '4' },
    { label: 'Option 5', value: '5' },
  ];

  return (
    <Stack direction="column" gap="$large" style={{ maxWidth: 400 }}>
      <Select label="Regular select" items={options} />

      <Select label="Disabled select" items={options} isDisabled />

      <Select label="Required select" items={options} isRequired />

      <Select label="With icon" icon="clock" items={options} />

      <Select
        label="Descriptions also"
        description="You should pick the third one"
        items={options}
      />

      <Select
        label="Some invalid choice"
        errorMessage="This is really bad"
        items={options}
      />
    </Stack>
  );
}
