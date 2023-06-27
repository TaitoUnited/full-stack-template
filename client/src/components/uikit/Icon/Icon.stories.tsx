import Tooltip from '../Tooltip';
import Stack from '../Stack';
import Icon from './index';
import { ids } from '~design-system/icon-sprite-ids';

export default {
  title: 'Icon',
  component: Icon,
};

export function AllIcons() {
  return (
    <Stack axis="x" spacing="large" fluid>
      {ids.map((name, i) => (
        <Tooltip title={name} key={i}>
          <Icon name={name} size={24} color="text" />
        </Tooltip>
      ))}
    </Stack>
  );
}
