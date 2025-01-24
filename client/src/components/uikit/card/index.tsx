import { styled } from '~/styled-system/jsx';

export const Card = styled('div', {
  base: {
    '--shadow-color': '0deg 0% 75%',
    padding: '$large',
    borderRadius: '$regular',
    backgroundColor: '$surface',
    outline: '1px solid rgba(0, 0, 0, 0.02)',
    boxShadow: `0px 1px 1.4px hsl(var(--shadow-color) / 0.11),
      0px 1.7px 2.3px -0.5px hsl(var(--shadow-color) / 0.22),
      0px 3.6px 4.9px -1px hsl(var(--shadow-color) / 0.33)`,
  },
});
