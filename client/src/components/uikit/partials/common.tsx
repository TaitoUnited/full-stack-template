import { ComponentProps } from 'react';
import { Label as AriaLabel, Text } from 'react-aria-components';
import styled, { css } from 'styled-components';
import { HiExclamation } from 'react-icons/hi';

import Icon from '../Icon';

export const inputWrapperStyles = css`
  display: flex;
  flex-direction: column;
  gap: ${p => p.theme.spacing.xxsmall}px;
`;

export const baseInputStyles = css`
  padding: ${p => p.theme.spacing.small}px;

  width: 100%;

  ${p => p.theme.typography.body};
  color: ${p => p.theme.colors.text};

  border-radius: ${p => p.theme.radii.normal}px;
  border: 1px solid ${p => p.theme.colors.border};

  --outline-width: 1px;
  outline-offset: calc(0px - var(--outline-width));

  &:focus {
    border-color: transparent;
    outline: var(--outline-width) solid ${p => p.theme.colors.primary};

    --outline-width: 3px;
  }

  &[aria-invalid='true'],
  &[data-invalid='true'] {
    border-color: transparent;
    outline: var(--outline-width) solid ${p => p.theme.colors.error};
  }

  &[disabled] {
    background-color: ${p => p.theme.colors.muted5};
    cursor: not-allowed;
  }
`;

/**
 * Add a `data-required` attribute to render an `*` after the label
 */
export const Label = styled(AriaLabel)`
  color: ${p => p.theme.colors.text};
  ${p => p.theme.typography.body}

  &[data-required="true"]:after {
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

export const DescriptionText = styled(Text).attrs({ slot: 'description' })`
  ${p => p.theme.typography.bodySmall};
`;

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
    <Icon icon={HiExclamation} size={14} color="error" />
    {children}
  </ErrorTextWrapper>
);
