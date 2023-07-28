import { Stack, TextArea } from '~uikit';

export default {
  title: 'TextArea',
  component: TextArea,
};

export function Example() {
  return (
    <Stack direction="column" gap="$large" style={{ maxWidth: 400 }}>
      <TextArea label="Test input" />

      <TextArea label="Disabled input" isDisabled />

      <TextArea label="Placeholder input" placeholder="Tell me why" />

      <TextArea label="Required input" isRequired />

      <TextArea
        label="Input with description"
        description="You should fill this one"
      />

      <TextArea label="Erroring input" errorMessage="Please don't do this" />
    </Stack>
  );
}
