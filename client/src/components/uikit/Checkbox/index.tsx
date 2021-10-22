import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { useToggleState } from 'react-stately';
import { useCheckbox, useFocusRing } from 'react-aria';
import { HiCheck } from 'react-icons/hi';

import Icon from '../Icon';

type CheckboxProps = NonNullable<Parameters<typeof useCheckbox>[0]>;

type Props = {
  label?: string;
  labelledby?: string;
  isChecked: boolean;
  onChange: NonNullable<CheckboxProps['onChange']>;
};

export default function Checkbox({
  label,
  labelledby,
  isChecked,
  onChange,
}: Props) {
  const state = useToggleState({ isSelected: isChecked, onChange });
  const ref = React.useRef<HTMLInputElement>(null);

  const { inputProps } = useCheckbox(
    {
      'aria-label': label,
      'aria-labelledby': labelledby,
      isSelected: isChecked,
      onChange,
    },
    state,
    ref
  );

  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <Wrapper isChecked={isChecked} isFocused={isFocusVisible}>
      <CheckboxBase {...inputProps} {...focusProps} ref={ref} />

      {isChecked && (
        <IconWrapper
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          aria-hidden
        >
          <Icon icon={HiCheck} size={14} color="currentColor" />
        </IconWrapper>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div<{ isChecked: boolean; isFocused: boolean }>`
  position: relative;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  background-color: ${p => (p.isChecked ? p.theme.colors.primary : 'white')};
  color: ${p => p.theme.colors.onPrimary};
  border-radius: ${p => p.theme.radii.small}px;
  border: 1px solid ${p => p.theme.colors[p.isChecked ? 'primary' : 'muted3']};

  ${p =>
    p.isFocused &&
    css`
      outline: 2px solid ${p.theme.colors.primary};
      outline-offset: 1px;
    `}
`;

const IconWrapper = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const CheckboxBase = styled.input`
  display: block;
  opacity: 0;
  width: 100%;
  height: 100%;
  margin: 0;
`;
