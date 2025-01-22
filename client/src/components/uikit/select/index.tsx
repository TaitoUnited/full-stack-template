import { type ComponentProps } from 'react';
import {
  Select as AriaSelect,
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  SelectValue,
} from 'react-aria-components';

import { css, cx } from '~styled-system/css';

import { Icon, type IconName } from '../icon';
import {
  DescriptionText,
  ErrorText,
  inputBaseStyles,
  inputIconLeftStyles,
  inputIconRightStyles,
  inputWrapperStyles,
  labelStyles,
  listBoxItemStyles,
  listBoxStyles,
} from '../partials/common';
import { SelectItem } from '../partials/select-item';

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
};

type Props = ComponentProps<typeof AriaSelect<SelectOption>> & {
  label: string;
  items: SelectOption[];
  description?: string;
  /** Passing an `errorMessage` as prop toggles the input as invalid. */
  errorMessage?: string;
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
  description,
  errorMessage,
  icon,
  items,
  ...rest
}: Props) {
  return (
    <AriaSelect
      {...rest}
      ref={ref}
      isInvalid={!!errorMessage}
      className={cx(inputWrapperStyles, rest.className as string)}
    >
      <Label className={labelStyles} data-required={rest.isRequired}>
        {label}
      </Label>

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

      {!!description && <DescriptionText>{description}</DescriptionText>}
      {!!errorMessage && <ErrorText>{errorMessage}</ErrorText>}

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
