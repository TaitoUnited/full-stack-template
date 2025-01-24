import { type Ref } from 'react';
import { type AriaSelectProps } from 'react-aria';
import {
  Select as AriaSelect,
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  SelectValue,
} from 'react-aria-components';

import { css, cx } from '~/styled-system/css';

import { Icon, type IconName } from '../icon';
import { type FormComponentProps } from '../partials/common';
import {
  FormInputContainer,
  inputBaseStyles,
  inputIconLeftStyles,
  inputIconRightStyles,
  inputWrapperStyles,
  labelStyles,
  listBoxItemStyles,
  listBoxStyles,
  useInputContext,
} from '../partials/common';
import { SelectItem } from '../partials/select-item';

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
  errorMessage,
  icon,
  items,
  value,
  onChange,
  ...rest
}: Props) {
  const inputContext = useInputContext();
  const labelPosition = labelPositionProp ?? inputContext.labelPosition;

  return (
    <AriaSelect
      {...rest}
      aria-labelledby={labelledby}
      aria-label={hiddenLabel}
      ref={ref}
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
            data-invalid={!!errorMessage}
            data-has-icon={!!icon}
            className={cx(
              inputBaseStyles,
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
      </FormInputContainer>

      <Popover offset={4}>
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
      </Popover>
    </AriaSelect>
  );
}
