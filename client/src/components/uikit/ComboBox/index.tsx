import { type ComponentProps, type Ref } from 'react';
import {
  ComboBox as AriaComboBox,
  Button,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
} from 'react-aria-components';

import { css, cx } from '~styled-system/css';
import { styled } from '~styled-system/jsx';

import { Icon, type IconName } from '../Icon';
import {
  DescriptionText,
  ErrorText,
  inputBaseStyles,
  inputIconLeftStyles,
  inputWrapperStyles,
  labelStyles,
  listBoxItemStyles,
  listBoxStyles,
} from '../partials/common';
import { SelectItem } from '../partials/SelectItem';

export type ComboBoxOption = {
  value: string;
  label: string;
  description?: string;
};

type Props = ComponentProps<typeof AriaComboBox<ComboBoxOption>> & {
  ref?: Ref<HTMLInputElement>;
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
export function ComboBox({
  ref,
  label,
  description,
  errorMessage,
  placeholder,
  icon,
  ...rest
}: Props) {
  return (
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
