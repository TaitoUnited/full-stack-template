import { forwardRef, ComponentProps, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Checkbox as AriaCheckbox } from 'react-aria-components';

import Icon from '../Icon';
import { css, cx } from '~styled-system/css';

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
      className={cx(
        css({
          display: 'flex',
          alignItems: 'center',
          gap: 'small',
          '& .checkbox': {
            position: 'relative',
            width: '18px',
            height: '18px',
            flexShrink: 0,
            backgroundColor: 'white',
            color: 'primaryMuted',
            borderRadius: 'small',
            border: '1px solid token(colors.muted3)',
          },
          '&[data-selected] > .checkbox, &[data-indeterminate] > .checkbox': {
            backgroundColor: 'primary',
            borderColor: 'primary',
          },
          '&[data-disabled] > .checkbox': {
            backgroundColor: 'muted5',
          },
          '&[data-focus-visible] > .checkbox': {
            outline: '2px solid token(colors.primary)',
            outlineOffset: '1px',
          },
        }),
        rest.className as string
      )}
    >
      {({ isSelected, isIndeterminate }) => (
        <>
          <div className="checkbox">
            {(isSelected || isIndeterminate) && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                aria-hidden
                className={css({
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                })}
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

Checkbox.displayName = 'Checkbox';

export default Checkbox;
