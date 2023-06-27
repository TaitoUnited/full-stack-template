import { forwardRef, ComponentProps } from 'react';
import styled from 'styled-components';

import {
  Button,
  Popover,
  Select as AriaSelect,
  SelectValue,
  Item,
  Label as AriaLabel,
} from 'react-aria-components';

import { IconName } from '../Icon';
import { ListBox } from '../partials/ListBox';

import {
  baseInputStyles,
  DescriptionText,
  ErrorText,
  InputIconLeft,
  InputIconRight,
  inputWrapperStyles,
  labelStyles,
} from '~components/uikit/partials/common';

type Option = {
  value: string;
  label: string;
};

type Props = ComponentProps<typeof AriaSelect<Option>> & {
  label: string;
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
  ({ label, description, errorMessage, icon, ...rest }, ref) => (
    <Wrapper
      {...rest}
      ref={ref}
      validationState={errorMessage ? 'invalid' : 'valid'}
    >
      <Label data-required={rest.isRequired}>{label}</Label>
      <InputWrapper>
        {icon && <InputIconLeft name={icon} size={20} color="muted1" />}

        <Input data-invalid={!!errorMessage}>
          <SelectValue />
        </Input>

        <InputIconRight name="chevronDown" size={20} color="muted1" />
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

const Wrapper = styled(AriaSelect)`
  ${inputWrapperStyles}
`;

const InputWrapper = styled.div`
  position: relative;

  & > svg + button {
    padding-left: ${p => p.theme.spacing.xlarge}px;
  }
`;

const Label = styled(AriaLabel)`
  ${labelStyles}
`;

const Input = styled(Button)`
  ${baseInputStyles}
  padding-right: ${p => p.theme.spacing.xlarge}px;
  text-align: inherit;

  & > *[data-placeholder] {
    color: ${p => p.theme.colors.muted1};
  }
`;

Select.displayName = 'Select';
export default Select;
