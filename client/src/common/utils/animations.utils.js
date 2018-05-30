import { keyframes } from 'styled-components';

export const appear = keyframes`
  from {
    opacity 0;
    transform: translateY(-22px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
`;

export const slideTop = keyframes`
  from {
    transform: translateY(-200px);
  }
  to {
    transform: translateY(0px);
  }
`;
