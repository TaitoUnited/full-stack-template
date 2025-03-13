import type { ComponentProps, Ref } from 'react';
import {
  ComboBox as AriaComboBox,
  Button,
  type ComboBoxProps,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
} from 'react-aria-components';

import { css, cx } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';
import { InputLayout } from '~/uikit/partials/input-layout';

import { Icon, type IconName } from '../icon';
import {
  type FormComponentProps,
  inputBaseStyles,
  inputIconLeftStyles,
  inputWrapperStyles,
  listBoxItemStyles,
  listBoxStyles,
  useInputContext,
} from '../partials/common';
import { SelectItem } from '../partials/select-item';
import { getValidationParams } from '../partials/validation';
import { Virtualizer } from '../partials/virtualizer';

export type ComboBoxOption = {
  value: string;
  label: string;
  render?: ComponentProps<typeof SelectItem>['render'];
  description?: string;
};

type Props = FormComponentProps<ComboBoxProps<ComboBoxOption>> & {
  ref?: Ref<HTMLInputElement>;
  icon?: IconName;
  virtualize?: boolean;
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
  validationMessage,
  placeholder,
  icon,
  value,
  onChange,
  items,
  virtualize,
  ...rest
}: Props) {
  const inputContext = useInputContext();
  const labelPosition = labelPositionProp ?? inputContext.labelPosition;
  const validation = getValidationParams(validationMessage);

  return (
    <AriaComboBox
      {...rest}
      defaultItems={items}
      aria-labelledby={labelledby}
      aria-label={hiddenLabel}
      isInvalid={validation.type === 'error'}
      className={cx(inputWrapperStyles({ labelPosition }), rest.className)}
      selectedKey={value}
      onSelectionChange={val => onChange?.(val as string)}
      menuTrigger="focus"
    >
      <InputLayout
        label={label}
        labelPosition={labelPosition}
        isRequired={rest.isRequired}
        description={description}
        validation={validation}
      >
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
            className={cx(inputBaseStyles(), css({ paddingRight: '!$large' }))}
          />

          <ChevronButton>
            <Icon name="arrowDropDown" size={24} color="text" />
          </ChevronButton>
        </InputWrapper>
      </InputLayout>

      <Popover data-testid="combobox-popover">
        <Virtualizer enabled={!!virtualize}>
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
                  render={option.render}
                  description={option.description}
                />
              </ListBoxItem>
            )}
          </ListBox>
        </Virtualizer>
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
