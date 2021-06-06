import * as faIcons from 'react-icons/fa';

import Tooltip from '../Tooltip';
import Stack from '../Stack';
import Icon from './index';

export default {
  title: 'Icon',
  component: Icon,
};

export function AllIcons() {
  return (
    <Stack axis="x" spacing="large" fluid>
      {Object.entries(faIcons).map(([name, icon], i) => (
        <Tooltip title={name} key={i}>
          <Icon icon={icon as any} size={24} color="text" />
        </Tooltip>
      ))}
    </Stack>
  );
}
