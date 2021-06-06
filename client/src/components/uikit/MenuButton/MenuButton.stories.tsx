import styled from 'styled-components';

import Stack from '../Stack';
import Text from '../Text';
import MenuButton from './index';

export default {
  title: 'MenuButton',
  component: MenuButton,
};

export function Example() {
  return (
    <Stack axis="y" spacing="xlarge">
      <Stack axis="x" spacing="small" align="center">
        <Text variant="body">Menu button with default trigger</Text>
        <MenuButton
          label="Some actions"
          onAction={action => window.alert(action)}
          actions={[
            { action: 'copy', label: 'Copy' },
            { action: 'cut', label: 'Cut' },
            { action: 'paste', label: 'Paste' },
          ]}
        />
      </Stack>

      <Stack axis="x" spacing="small" align="center">
        <Text variant="body">Menu button with a custom trigger</Text>
        <CustomMenuButton
          label="Some actions"
          onAction={action => window.alert(action)}
          actions={[
            { action: 'copy', label: 'Copy' },
            { action: 'cut', label: 'Cut' },
            { action: 'paste', label: 'Paste' },
          ]}
        >
          <Text variant="bodySmall">Custom trigger</Text>
        </CustomMenuButton>
      </Stack>
    </Stack>
  );
}

const CustomMenuButton = styled(MenuButton)`
  width: auto;
  height: auto;
  border-radius: ${p => p.theme.radii.small}px;
  border: 1px solid ${p => p.theme.colors.muted1};
  padding: ${p => p.theme.spacing.xsmall}px;
`;
