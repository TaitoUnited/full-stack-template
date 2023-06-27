import { ComponentProps } from 'react';
import { Text } from 'react-aria-components';
import styled, { css } from 'styled-components';

import Icon from '../Icon';

export const inputWrapperStyles = css`
  display: flex;
  flex-direction: column;
  gap: ${p => p.theme.spacing.xxsmall}px;
`;

export const baseInputStyles = css`
  --outline-width: 1px;
  ${p => p.theme.typography.body};
  padding: ${p => p.theme.spacing.small}px;
  width: 100%;
  color: ${p => p.theme.colors.text};
  border-radius: ${p => p.theme.radii.normal}px;
  border: 1px solid ${p => p.theme.colors.border};
  outline-offset: calc(0px - var(--outline-width));

  &:focus {
    --outline-width: 3px;
    border-color: transparent;
    outline: var(--outline-width) solid ${p => p.theme.colors.primary};
  }

  &[aria-invalid='true'],
  &[data-invalid='true'] {
    border-color: transparent;
    outline: var(--outline-width) solid ${p => p.theme.colors.error};
  }

  &[disabled] {
    background-color: ${p => p.theme.colors.muted6};
    cursor: not-allowed;
  }
`;

/**
 * Add a `data-required` attribute to render an `*` after the label
 */
export const labelStyles = css`
  ${p => p.theme.typography.body}
  color: ${p => p.theme.colors.text};
  margin-bottom: ${p => p.theme.spacing.xxsmall}px;

  &[data-required='true']:after {
    content: ' *';
  }
`;

export const InputIconLeft = styled(Icon)`
  position: absolute;
  margin-left: ${p => p.theme.spacing.normal}px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;

export const InputIconRight = styled(Icon)`
  position: absolute;
  margin-right: ${p => p.theme.spacing.normal}px;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;

const DescriptionTextWrapper = styled(Text).attrs({ slot: 'description' })`
  ${p => p.theme.typography.bodySmall};
`;

export const DescriptionText = (
  props: Omit<ComponentProps<typeof Text>, 'slot'>
) => <DescriptionTextWrapper {...props} slot="description" />;

const ErrorTextWrapper = styled(Text)`
  ${p => p.theme.typography.bodySmall};
  color: ${p => p.theme.colors.errorText};
  display: flex;
  align-items: center;

  & > svg {
    margin-right: ${p => p.theme.spacing.xxsmall}px;
  }
`;

export const ErrorText = ({
  children,
  ...rest
}: Omit<ComponentProps<typeof Text>, 'slot'>) => (
  <ErrorTextWrapper {...rest} slot="errorMessage">
    <Icon name="warningTriangle" size={14} color="error" />
    {children}
  </ErrorTextWrapper>
);
