import { ListBox as AriaListBox } from 'react-aria-components';
import styled from 'styled-components';

export const ListBox = styled(AriaListBox)`
  width: var(--trigger-width); /* magical var from react-aria */
  padding: ${p => p.theme.spacing.xsmall}px;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: ${p => p.theme.radii.normal}px;
  background-color: ${p => p.theme.colors.elevated};
  box-shadow: ${p => p.theme.shadows.normal};
  outline: none;

  /* The 'Item' component isn't the actual thing that gets rendered, so we need
   * to style it indirectly */
  .react-aria-Item {
    position: relative;
    padding: ${p => p.theme.spacing.xsmall}px ${p => p.theme.spacing.small}px;
    padding-left: ${p => p.theme.spacing.medium}px;
    border-radius: ${p => p.theme.radii.small}px;

    &[aria-selected='true'] {
      ${p => p.theme.typography.bodyStrong}

      &:before {
        content: '✓';
        position: absolute;
        left: 6px;
      }
    }

    &[data-focused='true'] {
      color: ${p => p.theme.colors.onPrimary};
      background-color: ${p => p.theme.colors.primary};
      outline: none;
    }
  }
`;
