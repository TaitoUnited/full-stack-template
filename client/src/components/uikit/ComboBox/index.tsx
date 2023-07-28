import { forwardRef, ComponentProps } from 'react';

import {
  Button,
  Popover,
  ComboBox as AriaComboBox,
  Item,
  Input,
  Label,
  ListBox,
} from 'react-aria-components';

import {
  baseInputStyles,
  DescriptionText,
  ErrorText,
  inputIconLeftStyles,
  inputWrapperStyles,
  labelStyles,
  listBoxStyles,
} from '~components/uikit/partials/common';

import Icon, { IconName } from '~components/uikit/Icon';
import { css, cx } from '~styled-system/css';

type Option = {
  value: string;
  label: string;
};

type Props = ComponentProps<typeof AriaComboBox<Option>> & {
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
const ComboBox = forwardRef<HTMLInputElement, Props>(
  ({ label, description, errorMessage, placeholder, icon, ...rest }, ref) => (
    <AriaComboBox
      {...rest}
      ref={ref}
      validationState={errorMessage ? 'invalid' : 'valid'}
      className={cx(inputWrapperStyles, rest.className as string)}
    >
      <Label className={labelStyles} data-required={rest.isRequired}>
        {label}
      </Label>

      <div
        className={css({
          position: 'relative',
          '& > svg + input': { paddingLeft: '$xlarge' },
        })}
      >
        {!!icon && (
          <Icon
            name={icon}
            size={20}
            color="muted1"
            className={inputIconLeftStyles}
          />
        )}

        <Input
          placeholder={placeholder}
          className={cx(baseInputStyles, css({ paddingRight: '$large' }))}
        />

        <Button
          className={css({
            position: 'absolute',
            height: '100%',
            top: '0px',
            right: '0px',
            paddingRight: '$small',
            paddingLeft: '$small',
            display: 'flex',
            alignItems: 'center',
          })}
        >
          <Icon name="chevronDown" size={20} color="muted1" />
        </Button>
      </div>

      {description && <DescriptionText>{description}</DescriptionText>}
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

      <Popover>
        <ListBox className={listBoxStyles}>
          {/* In cases like these, render props are preferred for perf reasons.
           * Ref: https://react-spectrum.adobe.com/react-stately/collections.html#why-not-array-map
           */}
          {({ label, value }: Option) => <Item id={value}>{label}</Item>}
        </ListBox>
      </Popover>
    </AriaComboBox>
  )
);

ComboBox.displayName = 'ComboBox';

export default ComboBox;
