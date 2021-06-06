import styled from 'styled-components';
import { t } from '@lingui/macro';
import { FiMoon, FiSun } from 'react-icons/fi';

import { useTheming } from '~services/theming';
import { activeOpacity, flexCenter, hoverHighlight } from '~utils/styled';
import { Icon, Tooltip } from '~uikit';

export default function ColorModeButton() {
  const { toggleTheme, currentTheme } = useTheming();

  return (
    <Tooltip
      position="left"
      title={
        currentTheme === 'light'
          ? t`Change theme to dark mode`
          : t`Change theme to light mode`
      }
    >
      <Wrapper onClick={toggleTheme}>
        {currentTheme === 'light' ? (
          <Icon icon={FiMoon} size="small" color="muted1" />
        ) : (
          <Icon icon={FiSun} size="small" color="muted1" />
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
