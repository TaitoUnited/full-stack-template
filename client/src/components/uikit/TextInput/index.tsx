import { useState, forwardRef, ComponentProps } from 'react';
import styled from 'styled-components';
import {
  TextField,
  Input as AriaInput,
  ToggleButton,
} from 'react-aria-components';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import type { IconType } from 'react-icons';

import Icon from '../Icon';
import { focusRing } from '~utils/styled';
import {
  inputWrapperStyles,
  InputIconLeft,
  Label,
  baseInputStyles,
  DescriptionText,
  ErrorText,
} from '~components/uikit/partials/common';

type Props = ComponentProps<typeof TextField> & {
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
      <Wrapper {...rest} validationState={errorMessage ? 'invalid' : 'valid'}>
        <Label data-required={rest.isRequired}>{label}</Label>

        <InputWrapper>
          {icon && <InputIconLeft icon={icon} size={20} color="muted1" />}

          <Input
            ref={ref}
            placeholder={placeholder}
            data-password={isPassword || undefined}
            type={
              isPassword ? (passwordVisible ? 'text' : 'password') : rest.type
            }
          />

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

        {description && <DescriptionText>{description}</DescriptionText>}
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      </Wrapper>
    );
  }
);

const Wrapper = styled(TextField)`
  ${inputWrapperStyles}
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
  ${baseInputStyles}
`;

TextInput.displayName = 'TextInput';
export default TextInput;
