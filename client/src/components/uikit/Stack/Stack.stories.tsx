import Stack from './index';
import { range } from '~utils/fn';

export default {
  title: 'Stack',
  component: Stack,
};

export function Horizontal() {
  return (
    <Stack axis="x" spacing="normal">
      {range(5).map(i => (
        <div
          key={i}
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'rgba(150, 150, 150, 0.5)',
          }}
        />
      ))}
    </Stack>
  );
}

export function Vertical() {
  return (
    <Stack axis="y" spacing="normal">
      {range(5).map(i => (
        <div
          key={i}
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'rgba(150, 150, 150, 0.5)',
          }}
        />
      ))}
    </Stack>
  );
}

export function Fluid() {
  return (
    <Stack axis="x" spacing="normal" fluid>
      {range(40).map(i => (
        <div
          key={i}
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'rgba(150, 150, 150, 0.5)',
          }}
        />
      ))}
    </Stack>
  );
}
