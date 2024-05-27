import { forwardRef, ComponentProps } from 'react';

import {
  Button,
  Popover,
  ComboBox as AriaComboBox,
  ListBoxItem,
  Input,
  Label,
  ListBox,
} from 'react-aria-components';

import { Icon, IconName } from '../Icon';

import {
  inputBaseStyles,
  DescriptionText,
  ErrorText,
  inputIconLeftStyles,
  inputWrapperStyles,
  labelStyles,
  listBoxItemStyles,
  listBoxStyles,
} from '../partials/common';

import { SelectItem } from '../partials/SelectItem';
import { css, cx } from '~styled-system/css';
import { styled } from '~styled-system/jsx';

export type ComboBoxOption = {
  value: string;
  label: string;
  description?: string;
};

type Props = ComponentProps<typeof AriaComboBox<ComboBoxOption>> & {
  label: string;
  description?: string;
  /** Passing an `errorMessage` as prop toggles the input as invalid. */
  errorMessage?: string;
  placeholder?: string;
  icon?: IconName;
};

/**
 * The `value`s of each option MUST be unique, otherwise render bugs will occur.
 *
 * Ref: https://react-spectrum.adobe.com/react-aria/ComboBox.html
 */
export const ComboBox = forwardRef<HTMLInputElement, Props>(
  ({ label, description, errorMessage, placeholder, icon, ...rest }, ref) => (
    <AriaComboBox
      {...rest}
      ref={ref}
      isInvalid={!!errorMessage}
      className={cx(inputWrapperStyles, rest.className as string)}
    >
      <Label className={labelStyles} data-required={rest.isRequired}>
        {label}
      </Label>

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
          placeholder={placeholder}
          className={cx(inputBaseStyles, css({ paddingRight: '$large' }))}
        />

        <ChevronButton>
          <Icon name="arrowDropDown" size={24} color="text" />
        </ChevronButton>
      </InputWrapper>

      {!!description && <DescriptionText>{description}</DescriptionText>}
      {!!errorMessage && <ErrorText>{errorMessage}</ErrorText>}

      <Popover>
        <ListBox className={listBoxStyles}>
          {/* In cases like these, render props are preferred for perf reasons.
           * Ref: https://react-spectrum.adobe.com/react-stately/collections.html#why-not-array-map
           */}
          {(option: ComboBoxOption) => (
            <ListBoxItem
              id={option.value}
              textValue={label}
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
  )
);

const InputWrapper = styled('div', {
  base: {
    position: 'relative',
    '& > svg + input': { paddingLeft: '$xl' },
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

ComboBox.displayName = 'ComboBox';
