import { Stack, IconButton, IconName } from '~uikit';

export default {
  title: 'IconButton',
  component: IconButton,
};

const icons: IconName[] = ['camera', 'bell', 'language'];

export function Example() {
  return (
    <Stack direction="row" gap="$large">
      {icons.map(icon => (
        <IconButton
          key={icon}
          icon={icon}
          label="Example"
          color="primary"
          tooltipPosition="bottom"
          onClick={() => console.log('Filled')}
        />
      ))}
    </Stack>
  );
}
