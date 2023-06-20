import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Checkbox as AriaCheckbox } from 'react-aria-components';
import { HiCheck, HiMinusSm } from 'react-icons/hi';

import Icon from '../Icon';

type CommonProps = React.ComponentProps<typeof AriaCheckbox>;

type PropsWithLabel = CommonProps & {
  /** Text string to be displayed next to the checkbox */
  label: React.ReactNode;
  labelledby?: undefined;
};

type PropsWithLabelledBy = CommonProps & {
  /** ID of an element that contains text naming this checkbox */
  labelledby: string;
  label?: undefined;
};

type Props = PropsWithLabel | PropsWithLabelledBy;

/**
 * For accessibility reasons, you need to provide either `label` or `labelledby` as a prop
 *
 * Ref: https://react-spectrum.adobe.com/react-aria/Checkbox.html
 */
const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ label, labelledby, ...rest }, ref) => (
    <AriaCheckboxWrapper aria-labelledby={labelledby} {...rest} ref={ref}>
      {({ isSelected, isIndeterminate }) => (
        <>
          <div className="checkbox">
            {(isSelected || isIndeterminate) && (
              <IconWrapper
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                aria-hidden
              >
                {isIndeterminate ? (
                  <Icon icon={HiMinusSm} size={14} color="currentColor" />
                ) : (
                  <Icon icon={HiCheck} size={14} color="currentColor" />
                )}
              </IconWrapper>
            )}
          </div>

          {label}
        </>
      )}
    </AriaCheckboxWrapper>
  )
);

const AriaCheckboxWrapper = styled(AriaCheckbox)`
  display: flex;
  align-items: center;
  gap: ${p => p.theme.spacing.small}px;

  & .checkbox {
    position: relative;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    background-color: 'white';
    color: ${p => p.theme.colors.onPrimary};
    border-radius: ${p => p.theme.radii.small}px;
    border: 1px solid ${p => p.theme.colors.muted3};
  }

  &[data-selected] > .checkbox,
  &[data-indeterminate] > .checkbox {
    background-color: ${p => p.theme.colors.primary};
    border-color: ${p => p.theme.colors.primary};
  }

  &[data-disabled] > .checkbox {
    background-color: ${p => p.theme.colors.muted5};
  }

  &[data-focus-visible] > .checkbox {
    outline: 2px solid ${p => p.theme.colors.primary};
    outline-offset: 1px;
  }
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

Checkbox.displayName = 'Checkbox';
export default Checkbox;
