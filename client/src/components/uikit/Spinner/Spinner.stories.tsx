import { Stack, Spinner } from '~uikit';

export default {
  title: 'Spinner',
  component: Spinner,
};

const colors = ['primary', 'text', 'info', 'warn', 'error'] as const;

export function Colors() {
  return (
    <Stack direction="row" gap="$normal">
      {colors.map(color => (
        <Spinner key={color} color={color} size="large" />
      ))}
    </Stack>
  );
}

export function Sizes() {
  return (
    <Stack direction="row" gap="$large">
      <Spinner color="primary" size="small" />
      <Spinner color="primary" size="normal" />
      <Spinner color="primary" size="medium" />
      <Spinner color="primary" size="large" />
    </Stack>
  );
}
