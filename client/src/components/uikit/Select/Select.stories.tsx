import { useState, ComponentProps } from 'react';
import { FaAward } from 'react-icons/fa';

import Stack from '../Stack';
import Select from './index';

export default {
  title: 'Select',
  component: Select,
};

export function Example() {
  const options = [
    { label: '', value: '' },
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
    { label: 'Option 4', value: '4' },
    { label: 'Option 5', value: '5' },
  ];

  return (
    <Stack axis="y" spacing="large" style={{ maxWidth: 400 }}>
      <TextInputExample label="Regular select" options={options} />
      <TextInputExample label="With icon" icon={FaAward} options={options} />
      <TextInputExample
        label="With info message"
        message="Hi, I'm a message about this select"
        options={options}
      />
      <TextInputExample
        label="Invalid select"
        isValid={false}
        message="Something wrong!"
        options={options}
      />
    </Stack>
  );
}

function TextInputExample(
  props: Omit<ComponentProps<typeof Select>, 'value' | 'onChange'>
) {
  const [value, setValue] = useState('');
  return (
    <Select
      {...props}
      value={value}
      onChange={(e: any) => setValue(e.currentTarget.value)}
    />
  );
}
