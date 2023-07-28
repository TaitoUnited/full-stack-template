import { css } from '~styled-system/css';
import { Stack } from '~styled-system/jsx';
import { Text, MenuButton } from '~uikit';

export default {
  title: 'MenuButton',
  component: MenuButton,
};

export function Example() {
  return (
    <Stack direction="column" gap="$xlarge">
      <Stack direction="row" gap="$small" align="center">
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

      <Stack direction="row" gap="$small" align="center">
        <Text variant="body">Menu button with a custom trigger</Text>
        <MenuButton
          className={menuButtonStyles}
          label="Some actions"
          onAction={action => window.alert(action)}
          actions={[
            { action: 'copy', label: 'Copy' },
            { action: 'cut', label: 'Cut' },
            { action: 'paste', label: 'Paste' },
          ]}
        >
          <Text variant="bodySmall">Custom trigger</Text>
        </MenuButton>
      </Stack>
    </Stack>
  );
}

const menuButtonStyles = css({
  width: 'auto',
  height: 'auto',
  borderRadius: '$small',
  border: '1px solid',
  borderColor: '$muted1',
  padding: '$xsmall',
});
