import { useState, ComponentProps } from 'react';
import { FaAddressBook, FaUser, FaMailBulk } from 'react-icons/fa';

import Stack from '../Stack';
import TextInput from './index';

export default {
  title: 'TextInput',
  component: TextInput,
};

export function Example() {
  return (
    <Stack axis="y" spacing="large" style={{ maxWidth: 400 }}>
      <TextInputExample label="Default input" />
      <TextInputExample label="Input with an icon" icon={FaAddressBook} />

      <TextInputExample label="Required input" icon={FaUser} isRequired />

      <TextInputExample
        label="Input with info message"
        message="This is an info message"
      />

      <TextInputExample
        label="Input with placeholder and validation"
        placeholder="john@doe.com"
        icon={FaMailBulk}
        isValid={false}
        message="Incorrect email address"
      />
    </Stack>
  );
}

function TextInputExample(
  props: Omit<ComponentProps<typeof TextInput>, 'value' | 'onChange'>
) {
  const [value, setValue] = useState('');

  return (
    <TextInput
      {...props}
      value={value}
      onChange={(e: any) => setValue(e.currentTarget.value)}
    />
  );
}
