import { forwardRef, ComponentProps } from 'react';
import styled from 'styled-components';

import {
  Button,
  Popover,
  ComboBox as AriaComboBox,
  Item,
  Input as AriaInput,
  Label as AriaLabel,
} from 'react-aria-components';

import {
  baseInputStyles,
  DescriptionText,
  ErrorText,
  InputIconLeft,
  inputWrapperStyles,
  labelStyles,
} from '~components/uikit/partials/common';

import { ListBox } from '~components/uikit/partials/ListBox';
import Icon, { IconName } from '~components/uikit/Icon';

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
    <Wrapper
      {...rest}
      ref={ref}
      validationState={errorMessage ? 'invalid' : 'valid'}
    >
      <Label data-required={rest.isRequired}>{label}</Label>
      <InputWrapper>
        {icon && <InputIconLeft name={icon} size={20} color="muted1" />}

        <Input placeholder={placeholder} />

        <InputButton>
          <Icon name="chevronDown" size={20} color="muted1" />
        </InputButton>
      </InputWrapper>

      {description && <DescriptionText>{description}</DescriptionText>}
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

      <Popover>
        <ListBox>
          {/* In cases like these, render props are preferred for perf reasons.
           * Ref: https://react-spectrum.adobe.com/react-stately/collections.html#why-not-array-map
           */}
          {({ label, value }: Option) => <Item id={value}>{label}</Item>}
        </ListBox>
      </Popover>
    </Wrapper>
  )
);

const Wrapper = styled(AriaComboBox)`
  ${inputWrapperStyles}
`;

const InputWrapper = styled.div`
  position: relative;

  & > svg + input {
    padding-left: ${p => p.theme.spacing.xlarge}px;
  }
`;

const Label = styled(AriaLabel)`
  ${labelStyles}
`;

const Input = styled(AriaInput)`
  ${baseInputStyles}
  padding-right: ${p => p.theme.spacing.large}px;
`;

const InputButton = styled(Button)`
  position: absolute;
  height: 100%;
  top: 0;
  right: 0;
  padding-right: ${p => p.theme.spacing.small}px;
  padding-left: ${p => p.theme.spacing.small}px;
  display: flex;
  align-items: center;
`;

ComboBox.displayName = 'ComboBox';
export default ComboBox;
