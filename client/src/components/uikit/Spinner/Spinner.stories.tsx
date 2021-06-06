import Stack from '../Stack';
import Spinner from './index';
import { Color } from '~constants/theme';

export default {
  title: 'Spinner',
  component: Spinner,
};

const colors: Partial<Color>[] = ['primary', 'text', 'info', 'warn', 'error'];

export function Colors() {
  return (
    <Stack axis="x" spacing="normal">
      {colors.map(color => (
        <Spinner key={color} color={color} size="large" />
      ))}
    </Stack>
  );
}

export function Sizes() {
  return (
    <Stack axis="x" spacing="large">
      <Spinner color="primary" size="small" />
      <Spinner color="primary" size="normal" />
      <Spinner color="primary" size="medium" />
      <Spinner color="primary" size="large" />
    </Stack>
  );
}
