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

import { Text } from '../Text';
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
} from '~components/uikit/partials/common';

import { css, cx } from '~styled-system/css';
import { Stack, styled } from '~styled-system/jsx';

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
          {({ label, description, value }: ComboBoxOption) => (
            <ListBoxItem
              className={listBoxItemStyles}
              id={value}
              textValue={label}
            >
              <Stack
                direction="row"
                gap="$small"
                align="center"
                justify="space-between"
              >
                <Stack direction="column" gap="$xxs">
                  <Text slot="label" variant="body">
                    {label}
                  </Text>

                  {!!description && (
                    <Text
                      slot="description"
                      variant="bodyExtraSmall"
                      color="textMuted"
                    >
                      {description}
                    </Text>
                  )}
                </Stack>

                <SelectedIcon
                  className="selected-icon"
                  name="check"
                  size={20}
                  color="text"
                />
              </Stack>
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

const SelectedIcon = styled(Icon, {
  base: {
    display: 'none',
  },
});

ComboBox.displayName = 'ComboBox';
