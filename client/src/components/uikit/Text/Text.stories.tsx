import { Stack, Text } from '~uikit';
import { theme } from '~constants/theme';
import { capitalize } from '~utils/fn';

export default {
  title: 'Text',
  component: Text,
};

export function AllVariants() {
  return (
    <Stack direction="column" gap="$large">
      {Object.keys(theme.typography).map(variant => (
        <Text variant={variant as any} color="text" key={variant}>
          {capitalize(variant).replace(/-/g, ' ')}
        </Text>
      ))}
    </Stack>
  );
}
