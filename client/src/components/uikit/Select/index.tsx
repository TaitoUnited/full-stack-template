import { forwardRef, ComponentProps } from 'react';

import {
  Button,
  Popover,
  Select as AriaSelect,
  SelectValue,
  ListBoxItem,
  Label,
  ListBox,
} from 'react-aria-components';

import {
  inputBaseStyles,
  DescriptionText,
  ErrorText,
  inputIconLeftStyles,
  inputIconRightStyles,
  inputWrapperStyles,
  labelStyles,
  listBoxStyles,
  listBoxItemStyles,
} from '../partials/common';

import { Icon, IconName } from '../Icon';
import { css, cx } from '~styled-system/css';

export type SelectOption = {
  value: string;
  label: string;
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
export const Select = forwardRef<HTMLDivElement, Props>(
  ({ label, description, errorMessage, icon, items, ...rest }, ref) => {
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
            {({ label, value }: SelectOption) => (
              <ListBoxItem className={listBoxItemStyles} id={value}>
                {label}
              </ListBoxItem>
            )}
          </ListBox>
        </Popover>
      </AriaSelect>
    );
  }
);

Select.displayName = 'Select';
