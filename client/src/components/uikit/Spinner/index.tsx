import styled, { keyframes } from 'styled-components';

import type { Color } from '~constants/theme';
import { absoluteFill } from '~utils/styled';

type Size = 'small' | 'normal' | 'medium' | 'large';

type Props = {
  color: Color | 'currentColor';
  size?: Size;
};

const rotateAnim = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
`;

const BORDER_SIZE = 3;

const sizes = {
  small: 12 + BORDER_SIZE,
  normal: 16 + BORDER_SIZE,
  medium: 24 + BORDER_SIZE,
  large: 48 + BORDER_SIZE,
};

const Spinner = styled.div<Props>`
  position: relative;
  width: ${p => sizes[p.size || 'normal']}px;
  height: ${p => sizes[p.size || 'normal']}px;
  color: ${p =>
    p.color === 'currentColor' ? 'currentColor' : p.theme.colors[p.color]};

  &:before {
    content: '';
    border-radius: 50%;
    border: ${BORDER_SIZE}px solid currentColor;
    opacity: 0.3;
    z-index: -1;
    ${absoluteFill}
  }

  &:after {
    content: '';
    animation: ${rotateAnim} 0.6s infinite linear;
    border-radius: 50%;
    border: ${BORDER_SIZE}px solid currentColor;
    border-top-color: transparent;
    z-index: 1;
    ${absoluteFill}
  }
`;

export default Spinner;
