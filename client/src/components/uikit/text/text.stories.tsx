import * as typography from '~/design-tokens/typography';
import { type Typography } from '~/design-tokens/types';
import { Stack } from '~/uikit/stack';
import { capitalize } from '~/utils/string';

import { Text } from '.';

export default {
  title: 'Text',
  component: Text,
};

export function AllVariants() {
  return (
    <Stack direction="column" gap="large">
      {Object.keys(typography)
        .filter((variant): variant is Typography => variant in typography)
        .map(variant => (
          <Text variant={variant} color="text" key={variant}>
            {capitalize(variant).replace(/-/g, ' ')}
          </Text>
        ))}
    </Stack>
  );
}

export function ResponsiveVariant() {
  return (
    <Text variant={{ base: 'displaySmall', mdDown: 'headingM' }}>
      Responsive typography
    </Text>
  );
}

export function DisplayOptions() {
  return (
    <Stack direction="column" gap="regular" style={{ maxWidth: '12rem' }}>
      <Text variant="body" color="currentColor" tabularNumeric>
        Invoice 001234
      </Text>

      <Text variant="body" truncate>
        This deliberately long text demonstrates single-line truncation.
      </Text>
    </Stack>
  );
}
