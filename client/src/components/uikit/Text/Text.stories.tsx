import { Stack, Text } from '~uikit';
import { capitalize } from '~utils/fn';
import { web as typography } from '~design-tokens/typography';

export default {
  title: 'Text',
  component: Text,
};

export function AllVariants() {
  return (
    <Stack direction="column" gap="$large">
      {Object.keys(typography).map(variant => (
        <Text variant={variant as any} color="text" key={variant}>
          {capitalize(variant).replace(/-/g, ' ')}
        </Text>
      ))}
    </Stack>
  );
}
