import { type Ref } from 'react';
import { type AriaSelectProps } from 'react-aria';
import {
  Select as AriaSelect,
  Button,
  ListBox,
  ListBoxItem,
  Popover,
  SelectValue,
} from 'react-aria-components';

import { css, cx } from '~/styled-system/css';

import { Icon, type IconName } from '../icon';
import {
  type FormComponentProps,
  inputBaseStyles,
  inputIconLeftStyles,
  inputIconRightStyles,
  inputWrapperStyles,
  listBoxItemStyles,
  listBoxStyles,
  useInputContext,
} from '../partials/common';
import { InputLayout } from '../partials/input-layout';
import { SelectItem } from '../partials/select-item';
import { getValidationParams } from '../partials/validation';
import { Virtualizer } from '../partials/virtualizer';

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
};

type Props = FormComponentProps<
  Omit<AriaSelectProps<SelectOption>, 'children'>
> & {
  ref?: Ref<HTMLDivElement>;
  items: SelectOption[];
  icon?: IconName;
  virtualize?: boolean;
};

/**
 * The `value`s of each option MUST be unique, otherwise render bugs will occur.
 *
 * Ref: https://react-spectrum.adobe.com/react-aria/Select.html
 */
export function Select({
  ref,
  label,
  labelledby,
  hiddenLabel,
  labelPosition: labelPositionProp,
  description,
  validationMessage,
  icon,
  items,
  value,
  onChange,
  virtualize,
  ...rest
}: Props) {
  const inputContext = useInputContext();
  const labelPosition = labelPositionProp ?? inputContext.labelPosition;
  const validation = getValidationParams(validationMessage);
  const isInvalid = validation.type !== 'valid';

  return (
    <AriaSelect
      {...rest}
      aria-labelledby={labelledby}
      aria-label={hiddenLabel}
      ref={ref}
      isInvalid={isInvalid}
      className={cx(inputWrapperStyles({ labelPosition }), rest.className)}
      selectedKey={value}
      onSelectionChange={val => onChange?.(val as string)}
    >
      <InputLayout
        label={label}
        labelPosition={labelPosition}
        isRequired={rest.isRequired}
        description={description}
        validation={validation}
      >
        <div className={css({ position: 'relative' })}>
          {!!icon && (
            <Icon
              name={icon}
              size={20}
              color="neutral1"
              className={inputIconLeftStyles}
            />
          )}

          <Button
            data-invalid={isInvalid}
            data-has-icon={!!icon}
            className={cx(
              inputBaseStyles({
                invalidVisible: validation.position === 'below',
              }),
              css({
                paddingRight: '$xl!',
                '&[data-has-icon="true"]': { paddingLeft: '$xl' },
                '& > *[data-placeholder]': { color: '$textMuted' },
              })
            )}
          >
            <SelectValue />
          </Button>

          <Icon
            name="arrowDropDown"
            size={24}
            color="text"
            className={cx(inputIconRightStyles, css({ right: '$xs!' }))}
          />
        </div>
      </InputLayout>

      <Popover offset={4}>
        <Virtualizer enabled={!!virtualize}>
          <ListBox className={listBoxStyles} items={items}>
            {/* In cases like these, render props are preferred for perf reasons.
             * Ref: https://react-spectrum.adobe.com/react-stately/collections.html#why-not-array-map
             */}
            {(option: SelectOption) => (
              <ListBoxItem
                id={option.value}
                textValue={option.label}
                className={listBoxItemStyles}
                data-testid="select-option"
              >
                <SelectItem
                  label={option.label}
                  description={option.description}
                />
              </ListBoxItem>
            )}
          </ListBox>
        </Virtualizer>
      </Popover>
    </AriaSelect>
  );
}
