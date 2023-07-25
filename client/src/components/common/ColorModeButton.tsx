import { t } from '@lingui/macro';

import { styled } from '~styled-system/jsx';
import { useTheme } from '~services/theming';
import { Icon, Tooltip } from '~uikit';

export default function ColorModeButton() {
  const { toggleTheme, theme } = useTheme();

  return (
    <Tooltip
      position="left"
      title={
        theme === 'light'
          ? t`Change theme to dark mode`
          : t`Change theme to light mode`
      }
    >
      <Wrapper onClick={toggleTheme}>
        <Icon
          name={theme === 'light' ? 'moon' : 'sun'}
          size={16}
          color="muted1"
        />
      </Wrapper>
    </Tooltip>
  );
}

const Wrapper = styled('button', {
  base: {
    height: '40px',
    width: '40px',
    borderRadius: '$full',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    $hoverHighlight: '',
    $pressOpacity: '',
  },
});
