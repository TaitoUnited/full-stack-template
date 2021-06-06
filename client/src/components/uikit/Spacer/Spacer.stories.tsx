import Stack from '../Stack';
import Spacer from './index';

export default {
  title: 'Spacer',
  component: Spacer,
};

export function Horizontal() {
  return (
    <Stack axis="x" spacing="normal">
      <div
        style={{
          width: 50,
          height: 50,
          backgroundColor: 'rgba(150, 150, 150, 0.5)',
        }}
      />
      <Spacer axis="x" size="large" />
      <div
        style={{
          width: 50,
          height: 50,
          backgroundColor: 'rgba(150, 150, 150, 0.5)',
        }}
      />
      <div
        style={{
          width: 50,
          height: 50,
          backgroundColor: 'rgba(150, 150, 150, 0.5)',
        }}
      />
    </Stack>
  );
}

export function Vertical() {
  return (
    <Stack axis="y" spacing="normal">
      <div
        style={{
          width: 50,
          height: 50,
          backgroundColor: 'rgba(150, 150, 150, 0.5)',
        }}
      />
      <Spacer axis="y" size="large" />
      <div
        style={{
          width: 50,
          height: 50,
          backgroundColor: 'rgba(150, 150, 150, 0.5)',
        }}
      />
      <div
        style={{
          width: 50,
          height: 50,
          backgroundColor: 'rgba(150, 150, 150, 0.5)',
        }}
      />
    </Stack>
  );
}
