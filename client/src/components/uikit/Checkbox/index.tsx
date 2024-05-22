import { forwardRef, ComponentProps, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Checkbox as AriaCheckbox } from 'react-aria-components';

import Icon from '../Icon';
import { styled } from '~styled-system/jsx';

type CommonProps = ComponentProps<typeof AriaCheckbox>;

type PropsWithLabel = CommonProps & {
  /** Text string to be displayed next to the checkbox */
  label: ReactNode;
  labelledby?: undefined;
  hiddenLabel?: undefined;
};

type PropsWithLabelledBy = CommonProps & {
  /** ID of an element that contains text naming this checkbox */
  labelledby: string;
  label?: undefined;
  hiddenLabel?: undefined;
};

type PropsWithHiddenLabel = CommonProps & {
  /** Aria label for the checkbox */
  hiddenLabel: string;
  labelledby?: undefined;
  label?: undefined;
};

type Props = PropsWithLabel | PropsWithLabelledBy | PropsWithHiddenLabel;

/**
 * For accessibility reasons, you need to provide either `label`, `labelledby`,
 * or `hiddenLabel` as a prop.
 *
 * Ref: https://react-spectrum.adobe.com/react-aria/Checkbox.html
 */
const Checkbox = forwardRef<HTMLLabelElement, Props>(
  ({ label, labelledby, hiddenLabel, ...rest }, ref) => (
    <Wrapper
      aria-labelledby={labelledby}
      aria-label={hiddenLabel}
      ref={ref}
      {...rest}
    >
      {state => (
        <>
          <Content
            isFocusVisible={state.isFocusVisible}
            isDisabled={state.isDisabled}
            isInvalid={state.isInvalid}
            state={
              state.isIndeterminate
                ? 'indeterminate'
                : state.isSelected
                ? 'selected'
                : 'unselected'
            }
          >
            {(state.isSelected || state.isIndeterminate) && (
              <Checkmark
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                aria-hidden
              >
                <Icon
                  name={state.isIndeterminate ? 'remove' : 'check'}
                  size={14}
                  color="currentColor"
                />
              </Checkmark>
            )}
          </Content>
          {label}
        </>
      )}
    </Wrapper>
  )
);

const Wrapper = styled(AriaCheckbox, {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '$xs',
  },
});

const Content = styled('div', {
  base: {
    position: 'relative',
    width: '18px',
    height: '18px',
    flexShrink: 0,
    borderRadius: '$small',
    borderWidth: '1px',
  },
  variants: {
    state: {
      unselected: {
        backgroundColor: '$surface',
        color: '$primaryMuted',
        borderColor: '$line1',
      },
      indeterminate: {
        backgroundColor: '$primaryMuted',
        borderColor: '$primary',
        color: '$primaryContrast',
      },
      selected: {
        backgroundColor: '$primaryContrast',
        borderColor: '$primaryContrast',
        color: '$primaryMuted',
      },
    },
    isInvalid: {
      true: {
        backgroundColor: '$errorMuted',
        borderColor: '$error',
        color: '$error',
      },
    },
    isDisabled: {
      true: {
        backgroundColor: '$neutral4',
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

const Checkmark = styled(motion.div, {
  base: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
