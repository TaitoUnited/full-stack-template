import Stack from '../Stack';
import Text from './index';
import { theme } from '~constants/theme';
import { capitalize } from '~utils/fn';

export default {
  title: 'Text',
  component: Text,
};

export function AllVariants() {
  return (
    <Stack axis="y" spacing="large">
      {Object.keys(theme.typography).map(variant => (
        <Text variant={variant as any} color="text" key={variant}>
          {capitalize(variant).replace(/-/g, ' ')}
        </Text>
      ))}
    </Stack>
  );
}
