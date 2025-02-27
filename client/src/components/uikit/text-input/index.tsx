import { useLingui } from '@lingui/react/macro';
import { type Ref, useState } from 'react';
import {
  Input,
  TextField,
  type TextFieldProps,
  ToggleButton,
} from 'react-aria-components';

import { cx } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';

import { Icon, type IconName } from '../icon';
import {
  type FormComponentProps,
  inputBaseStyles,
  inputIconLeftStyles,
  inputWrapperStyles,
  useInputContext,
} from '../partials/common';
import { InputLayout } from '../partials/input-layout';
import { getValidationParams } from '../partials/validation';

type Props = FormComponentProps<TextFieldProps> & {
  ref?: Ref<HTMLInputElement>;
  icon?: IconName;
};

/**
 * Ref: https://react-spectrum.adobe.com/react-aria/TextField.html
 */
export function TextInput({
  ref,
  label,
  labelledby,
  hiddenLabel,
  labelPosition: labelPositionProp,
  icon,
  description,
  validationMessage,
  placeholder,
  id,
  ...rest
}: Props) {
  const { t } = useLingui();
  const inputContext = useInputContext();
  const labelPosition = labelPositionProp ?? inputContext.labelPosition;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = rest.type === 'password';
  const validation = getValidationParams(validationMessage);

  // TODO: implement character count with max length clipping
  return (
    <TextField
      {...rest}
      aria-labelledby={labelledby}
      aria-label={hiddenLabel}
      className={cx(inputWrapperStyles({ labelPosition }), rest.className)}
      isInvalid={validation.type === 'error'}
    >
      <InputLayout
        label={label}
        labelPosition={labelPosition}
        isRequired={rest.isRequired}
        description={description}
        validation={validation}
      >
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
            className={inputBaseStyles({
              invalidVisible: validation.position === 'below',
            })}
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
      </InputLayout>
    </TextField>
  );
}

const InputContent = styled('div', {
  base: {
    position: 'relative',
    '& > svg + input': { paddingLeft: '$2xl' },
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

    '&:focus-visible': {
      $focusRing: true,
      outlineOffset: '-2px',
    },
  },
});
