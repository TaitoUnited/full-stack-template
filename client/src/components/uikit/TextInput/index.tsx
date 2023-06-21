import { useState, forwardRef } from 'react';
import styled from 'styled-components';
import {
  TextField,
  Label as AriaLabel,
  Input as AriaInput,
  Text as AriaText,
  ToggleButton,
} from 'react-aria-components';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import type { IconType } from 'react-icons';

import Icon from '../Icon';
import { focusRing } from '~utils/styled';
import { HiExclamation } from 'react-icons/hi';

type Props = React.ComponentProps<typeof TextField> & {
  label: string;
  icon?: IconType;
  description?: string;
  /** Passing an `errorMessage` as prop toggles the input as invalid. */
  errorMessage?: string;
  placeholder?: string;
};

/**
 * Ref: https://react-spectrum.adobe.com/react-aria/TextField.html
 */
const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ label, icon, description, errorMessage, placeholder, ...rest }, ref) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const isPassword = rest.type === 'password';

    return (
      <Wrapper
        {...rest}
        validationState={errorMessage ? 'invalid' : 'valid'}
        data-password={isPassword || undefined}
        type={isPassword ? (passwordVisible ? 'text' : 'password') : rest.type}
      >
        <Label>
          {label}
          {rest.isRequired && <span aria-hidden="true"> *</span>}
        </Label>

        <InputWrapper>
          {icon && <InputIcon icon={icon} size={20} color="muted1" />}

          <Input ref={ref} placeholder={placeholder} />

          {isPassword && (
            <PasswordToggleButton
              isSelected={passwordVisible}
              onChange={setPasswordVisible}
              aria-label="Show password"
            >
              <Icon
                icon={passwordVisible ? FiEyeOff : FiEye}
                size={20}
                color="muted1"
              />
            </PasswordToggleButton>
          )}
        </InputWrapper>

        {description && (
          <DescriptionText slot="description">{description}</DescriptionText>
        )}
        {errorMessage && (
          <ErrorText slot="errorMessage">
            <Icon icon={HiExclamation} size={14} color="error" />
            {errorMessage}
          </ErrorText>
        )}
      </Wrapper>
    );
  }
);

const Wrapper = styled(TextField)`
  display: flex;
  flex-direction: column;
  gap: ${p => p.theme.spacing.xxsmall}px;
`;

const Label = styled(AriaLabel)`
  color: ${p => p.theme.colors.primaryText};
  ${p => p.theme.typography.body}
`;

const InputWrapper = styled.div`
  position: relative;

  & > svg + input {
    padding-left: ${p => p.theme.spacing.xlarge}px;
  }

  & > input[data-password] {
    padding-right: ${p => p.theme.spacing.xlarge}px;
  }
`;

const InputIcon = styled(Icon)`
  position: absolute;
  margin-left: ${p => p.theme.spacing.normal}px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;

const PasswordToggleButton = styled(ToggleButton)`
  position: absolute;
  height: 100%;
  top: 0;
  right: 0;
  padding-right: ${p => p.theme.spacing.small}px;
  padding-left: ${p => p.theme.spacing.small}px;

  display: flex;
  align-items: center;

  &:focus-visible {
    ${focusRing}
  }
`;

const Input = styled(AriaInput)`
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

  &[aria-invalid] {
    border-color: transparent;
    outline: var(--outline-width) solid ${p => p.theme.colors.error};
  }

  &[disabled] {
    background-color: ${p => p.theme.colors.muted5};
  }
`;

const DescriptionText = styled(AriaText)`
  ${p => p.theme.typography.bodySmall};
`;

const ErrorText = styled(AriaText)`
  ${p => p.theme.typography.bodySmall};
  color: ${p => p.theme.colors.errorText};
  display: flex;
  align-items: center;

  & > svg {
    margin-right: ${p => p.theme.spacing.xxsmall}px;
  }
`;

TextInput.displayName = 'TextInput';
export default TextInput;
