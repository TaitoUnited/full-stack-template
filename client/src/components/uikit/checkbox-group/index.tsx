import { type Ref } from 'react';
import {
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps,
} from 'react-aria-components';

import { cx } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';
import { InputLayout } from '~/uikit/partials/input-layout';

import { Checkbox } from '../checkbox';
import {
  type FormComponentProps,
  inputWrapperStyles,
  useInputContext,
} from '../partials/common';
import { getValidationParams } from '../partials/validation';
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
  validationMessage,
  description,
  ...rest
}: Props) {
  const inputContext = useInputContext();
  const labelPosition = labelPositionProp ?? inputContext.labelPosition;
  const validation = getValidationParams(validationMessage);

  return (
    <AriaCheckboxGroup
      ref={ref}
      className={cx(inputWrapperStyles({ labelPosition }), rest.className)}
      isInvalid={validation.type === 'error'}
      aria-labelledby={labelledby}
      aria-label={hiddenLabel}
      {...rest}
    >
      <InputLayout
        label={label}
        labelPosition={labelPosition}
        isRequired={rest.isRequired}
        description={description}
        validation={validation}
      >
        <Stack direction="column" gap="$xs">
          {options.map(option => (
            <CheckboxGroupItem key={option.label}>
              <Checkbox {...option} />
            </CheckboxGroupItem>
          ))}
        </Stack>
      </InputLayout>
    </AriaCheckboxGroup>
  );
}

const CheckboxGroupItem = styled('div', {
  base: {
    padding: '$xxs',
  },
});
