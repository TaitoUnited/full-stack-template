import { Stack, Tooltip, Icon } from '~uikit';
import { ids } from '~design-system/icon-sprite-ids';

export default {
  title: 'Icon',
  component: Icon,
};

export function AllIcons() {
  return (
    <Stack direction="row" gap="large" flexWrap="wrap">
      {ids.map((name, i) => (
        <Tooltip title={name} key={i}>
          <Icon name={name} size={24} color="text" />
        </Tooltip>
      ))}
    </Stack>
  );
}
