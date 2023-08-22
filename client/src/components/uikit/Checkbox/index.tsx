import { forwardRef, ComponentProps, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Checkbox as AriaCheckbox } from 'react-aria-components';

import Icon from '../Icon';
import { css, cva, cx } from '~styled-system/css';

type CommonProps = ComponentProps<typeof AriaCheckbox>;

type PropsWithLabel = CommonProps & {
  /** Text string to be displayed next to the checkbox */
  label: ReactNode;
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
    <AriaCheckbox
      aria-labelledby={labelledby}
      {...rest}
      ref={ref}
      className={cx(wrapperStyles, rest.className as string)}
    >
      {({ isSelected, isIndeterminate, isDisabled, isFocusVisible }) => (
        <>
          <div
            className={checkboxStyles({
              isSelected: isSelected || isIndeterminate,
              isDisabled,
              isFocusVisible,
            })}
          >
            {(isSelected || isIndeterminate) && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                aria-hidden
                className={checkmarkStyles}
              >
                <Icon
                  name={isIndeterminate ? 'minus' : 'checkmark'}
                  size={14}
                  color="currentColor"
                />
              </motion.div>
            )}
          </div>
          {label}
        </>
      )}
    </AriaCheckbox>
  )
);

const wrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '$xsmall',
});

const checkboxStyles = cva({
  base: {
    position: 'relative',
    width: '18px',
    height: '18px',
    flexShrink: 0,
    backgroundColor: '$elevated ',
    color: '$infoMuted',
    borderRadius: '$small',
    border: '1px solid',
    borderColor: '$border',
  },
  variants: {
    isSelected: {
      true: {
        backgroundColor: '$infoText',
        borderColor: '$infoText',
      },
    },
    isDisabled: {
      true: {
        backgroundColor: '$muted4',
        borderColor: '$textMuted!',
        color: '$textMuted',
        cursor: 'not-allowed',
      },
    },
    isFocusVisible: {
      true: {
        outline: '2px solid',
        outlineColor: '$info',
        outlineOffset: '1px',
      },
    },
  },
});

const checkmarkStyles = css({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
