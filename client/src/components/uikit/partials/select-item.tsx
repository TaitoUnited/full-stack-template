import { SelectedIcon } from './common';
import { Stack } from '../stack';
import { Text } from '../text';

type Props = {
  label: string;
  description?: string;
};

export function SelectItem({ label, description }: Props) {
  return (
    <Stack direction="row" gap="small" align="center" justify="space-between">
      <Stack direction="column" gap="xxs">
        <Text slot="label" variant="body">
          {label}
        </Text>

        {!!description && (
          <Text slot="description" variant="bodyExtraSmall" color="textMuted">
            {description}
          </Text>
        )}
      </Stack>
      <SelectedIcon />
    </Stack>
  );
}
