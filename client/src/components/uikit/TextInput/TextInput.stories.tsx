import Stack from '../Stack';
import TextInput from './index';

export default {
  title: 'TextInput',
  component: TextInput,
};

export function Example() {
  return (
    <Stack axis="y" spacing="large" style={{ maxWidth: 400 }}>
      <TextInput label="Test input" />

      <TextInput label="Disabled input" isDisabled />

      <TextInput label="Placeholder input" placeholder="Tell me why" />

      <TextInput label="Required input" isRequired />

      <TextInput
        label="Input with description"
        description="You should fill this one"
      />

      <TextInput label="Erroring input" errorMessage="Please don't do this" />

      <TextInput label="Icon input" icon="microphone" />

      <TextInput label="Password input" type="password" />
    </Stack>
  );
}
