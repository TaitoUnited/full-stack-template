import { type Ref } from 'react';
import {
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps,
  Label,
} from 'react-aria-components';

import { cx } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';

import { Checkbox } from '../checkbox';
import { type FormComponentProps } from '../partials/common';
import {
  FormInputContainer,
  inputWrapperStyles,
  labelStyles,
  useInputContext,
} from '../partials/common';
import { Stack } from '../stack';

type Option = {
  value: string;
  label: string;
  isSelected?: boolean;
};

type Props = Omit<
  FormComponentProps<CheckboxGroupProps>,
  'value' | 'onChange'
> & {
  ref?: Ref<HTMLDivElement>;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
};

export function CheckboxGroup({
  ref,
  options,
  label,
  labelledby,
  hiddenLabel,
  labelPosition: labelPositionProp,
  errorMessage,
  description,
  ...rest
}: Props) {
  const inputContext = useInputContext();
  const labelPosition = labelPositionProp ?? inputContext.labelPosition;

  return (
    <AriaCheckboxGroup
      ref={ref}
      className={cx(inputWrapperStyles({ labelPosition }), rest.className)}
      isInvalid={!!errorMessage}
      aria-labelledby={labelledby}
      aria-label={hiddenLabel}
      {...rest}
    >
      {!!label && (
        <Label
          data-required={rest.isRequired}
          className={labelStyles({ labelPosition })}
        >
          {label}
        </Label>
      )}

      <FormInputContainer description={description} errorMessage={errorMessage}>
        <Stack direction="column" gap="xs">
          {options.map(option => (
            <CheckboxGroupItem key={option.label}>
              <Checkbox {...option} />
            </CheckboxGroupItem>
          ))}
        </Stack>
      </FormInputContainer>
    </AriaCheckboxGroup>
  );
}

const CheckboxGroupItem = styled('div', {
  base: {
    padding: '$xxs',
  },
});

CheckboxGroup.displayName = 'CheckboxGroup';
