import styled from 'styled-components';
import { t } from '@lingui/macro';
import { FiMoon, FiSun } from 'react-icons/fi';

import { useTheming } from '~services/theming';
import { activeOpacity, flexCenter, hoverHighlight } from '~utils/styled';
import { Icon, Tooltip } from '~uikit';

export default function ColorModeButton() {
  const { toggleTheme, theme } = useTheming();

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
        {theme === 'light' ? (
          <Icon icon={FiMoon} size={16} color="muted1" />
        ) : (
          <Icon icon={FiSun} size={16} color="muted1" />
        )}
      </Wrapper>
    </Tooltip>
  );
}

const Wrapper = styled.button`
  height: 40px;
  width: 40px;
  border-radius: ${p => p.theme.radii.full}px;
  ${flexCenter}
  ${hoverHighlight}
  ${activeOpacity}
`;
