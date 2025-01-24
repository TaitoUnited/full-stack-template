import { type Ref } from 'react';
import { type ComboBoxProps } from 'react-aria-components';
import {
  ComboBox as AriaComboBox,
  Button,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
} from 'react-aria-components';

import { css, cx } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';

import { Icon, type IconName } from '../icon';
import { type FormComponentProps } from '../partials/common';
import {
  FormInputContainer,
  inputBaseStyles,
  inputIconLeftStyles,
  inputWrapperStyles,
  labelStyles,
  listBoxItemStyles,
  listBoxStyles,
  useInputContext,
} from '../partials/common';
import { SelectItem } from '../partials/select-item';

export type ComboBoxOption = {
  value: string;
  label: string;
  description?: string;
};

type Props = FormComponentProps<ComboBoxProps<ComboBoxOption>> & {
  ref?: Ref<HTMLInputElement>;
  icon?: IconName;
};

/**
 * The `value`s of each option MUST be unique, otherwise render bugs will occur.
 *
 * Ref: https://react-spectrum.adobe.com/react-aria/ComboBox.html
 */
export function ComboBox({
  ref,
  label,
  labelledby,
  hiddenLabel,
  labelPosition: labelPositionProp,
  description,
  errorMessage,
  placeholder,
  icon,
  value,
  onChange,
  ...rest
}: Props) {
  const inputContext = useInputContext();
  const labelPosition = labelPositionProp ?? inputContext.labelPosition;

  return (
    <AriaComboBox
      {...rest}
      aria-labelledby={labelledby}
      aria-label={hiddenLabel}
      isInvalid={!!errorMessage}
      className={cx(inputWrapperStyles({ labelPosition }), rest.className)}
      selectedKey={value}
      onSelectionChange={val => onChange?.(val as string)}
    >
      {!!label && (
        <Label
          className={labelStyles({ labelPosition })}
          data-required={rest.isRequired}
        >
          {label}
        </Label>
      )}

      <FormInputContainer description={description} errorMessage={errorMessage}>
        <InputWrapper>
          {!!icon && (
            <Icon
              name={icon}
              size={20}
              color="neutral1"
              className={inputIconLeftStyles}
            />
          )}

          <Input
            ref={ref}
            placeholder={placeholder}
            className={cx(inputBaseStyles, css({ paddingRight: '$large' }))}
          />

          <ChevronButton>
            <Icon name="arrowDropDown" size={24} color="text" />
          </ChevronButton>
        </InputWrapper>
      </FormInputContainer>

      <Popover data-testid="combobox-popover">
        <ListBox className={listBoxStyles}>
          {/* In cases like these, render props are preferred for perf reasons.
           * Ref: https://react-spectrum.adobe.com/react-stately/collections.html#why-not-array-map
           */}
          {(option: ComboBoxOption) => (
            <ListBoxItem
              id={option.value}
              textValue={option.label}
              className={listBoxItemStyles}
            >
              <SelectItem
                label={option.label}
                description={option.description}
              />
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
}

const InputWrapper = styled('div', {
  base: {
    position: 'relative',
    '& > svg + input': { paddingLeft: '$2xl' },
  },
});

const ChevronButton = styled(Button, {
  base: {
    position: 'absolute',
    height: '100%',
    top: '0px',
    right: '0px',
    paddingRight: '$small',
    paddingLeft: '$small',
    display: 'flex',
    alignItems: 'center',
  },
});
