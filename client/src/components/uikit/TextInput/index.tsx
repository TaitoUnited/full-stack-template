import { useState, forwardRef, ComponentProps } from 'react';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { TextField, Input, Label, ToggleButton } from 'react-aria-components';

import {
  inputWrapperStyles,
  inputIconLeftStyles,
  labelStyles,
  inputBaseStyles,
  DescriptionText,
  ErrorText,
} from '../partials/common';

import { Icon, IconName } from '../Icon';
import { cx } from '~styled-system/css';
import { styled } from '~styled-system/jsx';

type Props = ComponentProps<typeof TextField> & {
  label: string;
  icon?: IconName;
  description?: string;
  /** Passing an `errorMessage` as prop toggles the input as invalid. */
  errorMessage?: string;
  placeholder?: string;
  className?: string;
};

/**
 * Ref: https://react-spectrum.adobe.com/react-aria/TextField.html
 */
export const TextInput = forwardRef<HTMLInputElement, Props>(
  (
    { label, icon, description, errorMessage, placeholder, id, ...rest },
    ref
  ) => {
    useLingui();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const isPassword = rest.type === 'password';

    return (
      <TextField
        {...rest}
        className={cx(inputWrapperStyles, rest.className)}
        isInvalid={!!errorMessage}
      >
        <Label className={labelStyles} data-required={rest.isRequired}>
          {label}
        </Label>

        <InputContent>
          {!!icon && (
            <Icon
              className={inputIconLeftStyles}
              name={icon}
              size={20}
              color="neutral1"
            />
          )}

          <Input
            ref={ref}
            id={id}
            placeholder={placeholder}
            className={inputBaseStyles}
            data-password={isPassword || undefined}
            type={
              isPassword ? (passwordVisible ? 'text' : 'password') : rest.type
            }
          />

          {isPassword && (
            <PasswordToggleButton
              isSelected={passwordVisible}
              onChange={setPasswordVisible}
              aria-label={t`Show password`}
            >
              <Icon
                name={passwordVisible ? 'eye' : 'eyeOff'}
                size={20}
                color="neutral1"
              />
            </PasswordToggleButton>
          )}
        </InputContent>

        {!!description && <DescriptionText>{description}</DescriptionText>}
        {!!errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      </TextField>
    );
  }
);

const InputContent = styled('div', {
  base: {
    position: 'relative',
    '& > svg + input': { paddingLeft: '$xl' },
    '& > input[data-password]': { paddingRight: '$xl' },
  },
});

const PasswordToggleButton = styled(ToggleButton, {
  base: {
    position: 'absolute',
    height: '100%',
    top: '0px',
    right: '0px',
    paddingRight: '$small',
    paddingLeft: '$small',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '$regular',
    $focusRing: true,
  },
});

TextInput.displayName = 'TextInput';
