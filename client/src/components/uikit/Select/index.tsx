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
  baseInputStyles,
  DescriptionText,
  ErrorText,
  inputIconLeftStyles,
  inputIconRightStyles,
  inputWrapperStyles,
  labelStyles,
  listBoxStyles,
} from '../partials/common';

import Icon, { IconName } from '../Icon';
import { css, cx } from '~styled-system/css';

type Option = {
  value: string;
  label: string;
};

type Props = ComponentProps<typeof AriaSelect<Option>> & {
  label: string;
  items: Option[];
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
const Select = forwardRef<HTMLDivElement, Props>(
  ({ label, description, errorMessage, icon, items, ...rest }, ref) => (
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
            baseInputStyles,
            css({
              textAlign: 'left',
              paddingRight: '$xl!',
              '&[data-has-icon="true"]': { paddingLeft: '$xl' },
              '& > *[data-placeholder]': { color: '$neutral1' },
            })
          )}
        >
          <SelectValue />
        </Button>

        <Icon
          name="chevronDown"
          size={20}
          color="neutral1"
          className={inputIconRightStyles}
        />
      </div>

      {description && <DescriptionText>{description}</DescriptionText>}
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

      <Popover>
        <ListBox className={listBoxStyles} items={items}>
          {/* In cases like these, render props are preferred for perf reasons.
           * Ref: https://react-spectrum.adobe.com/react-stately/collections.html#why-not-array-map
           */}
          {({ label, value }: Option) => (
            <ListBoxItem id={value}>{label}</ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaSelect>
  )
);

Select.displayName = 'Select';

export default Select;
