import { forwardRef } from 'react';
import styled from 'styled-components';
import {
  Button,
  Popover,
  Select as AriaSelect,
  SelectValue,
  Item,
} from 'react-aria-components';
import { FaChevronDown } from 'react-icons/fa';
import type { IconType } from 'react-icons';

import {
  baseInputStyles,
  DescriptionText,
  ErrorText,
  InputIconLeft,
  InputIconRight,
  inputWrapperStyles,
  Label,
} from '~components/uikit/partials/common';
import { ListBox } from '~components/uikit/partials/ListBox';

type Option = {
  value: string;
  label: string;
};

type Props = React.ComponentProps<typeof AriaSelect<Option>> & {
  label: string;
  description?: string;
  /** Passing an `errorMessage` as prop toggles the input as invalid. */
  errorMessage?: string;
  icon?: IconType;
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
        {icon && <InputIconLeft icon={icon} size={20} color="muted1" />}

        <Input data-invalid={!!errorMessage}>
          <SelectValue />
        </Input>

        <InputIconRight icon={FaChevronDown} size={12} color="muted1" />
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
