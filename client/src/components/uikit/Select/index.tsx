import { InputHTMLAttributes, forwardRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { FaChevronDown } from 'react-icons/fa';
import type { IconType } from 'react-icons';

import Text from '../Text';
import Icon from '../Icon';

type Option = {
  value: string;
  label: string;
};

type Props = InputHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
  label: string;
  icon?: IconType;
  isValid?: boolean;
  isRequired?: boolean;
  message?: string;
};

const Select = forwardRef(
  (
    {
      value,
      options,
      label,
      icon,
      onChange,
      message,
      isValid = true,
      isRequired = false,
      className,
      style,
      ...rest
    }: Props,
    ref: any
  ) => {
    const [isFocused, setFocused] = useState(false);
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);
    const id = `select-${label.toLowerCase().replace(/\s/g, '')}`;

    return (
      <Wrapper className={className} style={style}>
        <Label
          htmlFor={id}
          isValid={isValid}
          isAnimated={isFocused || !!value}
          hasIcon={!!icon}
        >
          {label}
          {isRequired && <span aria-hidden="true">*</span>}
        </Label>

        <InputWrapper isValid={isValid}>
          {icon && (
            <IconWrapper>
              <Icon icon={icon} size={20} color="muted1" />
            </IconWrapper>
          )}

          <SelectInput
            {...rest}
            ref={ref}
            id={id}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            hasIcon={!!icon}
          >
            {options.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectInput>

          <ArrowDown aria-hidden="true" className="select-arrow">
            <Icon icon={FaChevronDown} size={12} color="muted1" />
          </ArrowDown>

          <Fieldset aria-hidden="true" isValid={isValid} isFocused={isFocused}>
            <Legend isValid={isValid} isAnimated={isFocused || !!value}>
              <span>
                {label}
                {isRequired ? '*' : ''}
              </span>
            </Legend>
          </Fieldset>
        </InputWrapper>

        {/* TODO: figure out the a11y part of this message... */}
        {!!message && (
          <Message variant="bodySmall" color={isValid ? 'text' : 'warn'}>
            {message}
          </Message>
        )}
      </Wrapper>
    );
  }
);

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 0;
  min-width: 200px;
`;

type LabelProps = { isAnimated: boolean; isValid: boolean; hasIcon: boolean };

const Label = styled.label<LabelProps>`
  ${p => p.theme.typography.body}
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  line-height: 1;
  pointer-events: none;
  color: ${p => p.theme.colors.muted1};
  transform-origin: top left;
  transition: color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  transform: ${p =>
    `translate(${
      p.theme.spacing.normal + (p.hasIcon ? p.theme.spacing.large : 0)
    }px, ${p.theme.spacing.normal + 2}px) scale(1)`};

  ${p =>
    p.isAnimated &&
    css`
      color: ${p.theme.colors[p.isValid ? 'info' : 'warn']};
      transform: translate(16px, -6px) scale(0.75);
    `}
`;

const InputWrapper = styled.div<{ isValid: boolean }>`
  position: relative;
  display: flex;
  flex-direction: row;
  border-radius: ${p => p.theme.radii.normal}px;
`;

const Fieldset = styled.fieldset<{ isValid: boolean; isFocused: boolean }>`
  position: absolute;
  left: 0;
  top: -6px;
  bottom: 0;
  right: 0;
  overflow: hidden;
  pointer-events: none;
  margin: 0;
  padding: ${p => p.theme.spacing.normal}px ${p => p.theme.spacing.small}px;
  border-radius: inherit;
  border: 1px solid ${p => p.theme.colors[p.isValid ? 'border' : 'warn']};

  ${p =>
    p.isFocused &&
    css`
      border-color: ${p.theme.colors[p.isValid ? 'info' : 'warn']};
    `}
`;

const Legend = styled.legend<{ isAnimated: boolean; isValid: boolean }>`
  width: auto;
  height: 12px;
  display: block;
  padding: 0;
  font-size: 0.75em;
  max-width: 0.01px;
  text-align: left;
  transition: max-width 50ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  visibility: hidden;

  span {
    display: inline-block;
    padding-left: 4px;
    padding-right: 4px;
  }

  ${p =>
    p.isAnimated &&
    css`
      max-width: 1000px;
      transition: max-width 100ms cubic-bezier(0, 0, 0.2, 1) 50ms;
    `}
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: ${p => p.theme.spacing.normal}px;
  pointer-events: none;
`;

const SelectInput = styled.select<{ hasIcon: boolean }>`
  ${p => p.theme.typography.body}
  color: ${p => p.theme.colors.text};
  flex-grow: 1;
  padding-top: ${p => p.theme.spacing.normal}px;
  padding-bottom: ${p => p.theme.spacing.normal}px;
  padding-right: ${p => p.theme.spacing.normal}px;
  padding-left: ${p =>
    p.hasIcon ? p.theme.spacing.xlarge + 8 : p.theme.spacing.normal}px;
  border-radius: inherit;

  &::placeholder {
    color: transparent;
  }

  &:focus {
    &::placeholder {
      color: ${p => p.theme.colors.muted1};
    }
  }
`;

const ArrowDown = styled.span`
  display: inline-block;
  position: absolute;
  right: ${p => p.theme.spacing.normal}px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;

const Message = styled(Text)`
  margin-top: ${p => p.theme.spacing.xsmall}px;
  margin-left: ${p => p.theme.spacing.xsmall}px;
`;

Select.displayName = 'Select';

export default Select;
