import { useState, forwardRef, ComponentProps } from 'react';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { TextField, Input, Label, ToggleButton } from 'react-aria-components';

import {
  inputWrapperStyles,
  inputIconLeftStyles,
  labelStyles,
  baseInputStyles,
  DescriptionText,
  ErrorText,
} from '../partials/common';

import Icon, { IconName } from '../Icon';
import { css, cx } from '~styled-system/css';

type Props = ComponentProps<typeof TextField> & {
  label: string;
  icon?: IconName;
  description?: string;
  /** Passing an `errorMessage` as prop toggles the input as invalid. */
  errorMessage?: string;
  placeholder?: string;
};

/**
 * Ref: https://react-spectrum.adobe.com/react-aria/TextField.html
 */
const TextInput = forwardRef<HTMLInputElement, Props>(
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
        validationState={errorMessage ? 'invalid' : 'valid'}
      >
        <Label className={labelStyles} data-required={rest.isRequired}>
          {label}
        </Label>

        <div
          className={css({
            position: 'relative',
            '& > svg + input': { paddingLeft: '$xlarge' },
            '& > input[data-password]': { paddingRight: '$xlarge' },
          })}
        >
          {!!icon && (
            <Icon
              className={inputIconLeftStyles}
              name={icon}
              size={20}
              color="muted1"
            />
          )}

          <Input
            ref={ref}
            id={id}
            placeholder={placeholder}
            className={baseInputStyles}
            data-password={isPassword || undefined}
            type={
              isPassword ? (passwordVisible ? 'text' : 'password') : rest.type
            }
          />

          {isPassword && (
            <ToggleButton
              isSelected={passwordVisible}
              onChange={setPasswordVisible}
              aria-label={t`Show password`}
              className={cx(
                css({
                  position: 'absolute',
                  height: '100%',
                  top: '0px',
                  right: '0px',
                  paddingRight: '$small',
                  paddingLeft: '$small',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '$normal',
                  $focusRing: '',
                })
              )}
            >
              <Icon
                name={passwordVisible ? 'eyeFilled' : 'eyeOutlined'}
                size={20}
                color="muted1"
              />
            </ToggleButton>
          )}
        </div>

        {description && <DescriptionText>{description}</DescriptionText>}
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      </TextField>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
