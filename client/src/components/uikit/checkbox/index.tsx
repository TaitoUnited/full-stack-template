import { type Ref } from 'react';
import { type AriaCheckboxProps } from 'react-aria';
import { Checkbox as AriaCheckbox } from 'react-aria-components';

import { styled } from '~/styled-system/jsx';

import { Icon } from '../icon';
import type { PropsWithLabelOptions } from '../partials/common';

type Props = PropsWithLabelOptions<AriaCheckboxProps & { slot?: string }>;

export function Checkbox({
  ref,
  label,
  labelledby,
  hiddenLabel,
  ...rest
}: Props & { ref?: Ref<HTMLLabelElement> }) {
  return (
    <Wrapper
      aria-labelledby={labelledby}
      aria-label={hiddenLabel}
      ref={ref}
      {...rest}
    >
      {state => {
        return (
          <Content>
            <CheckmarkWrapper
              isFocusVisible={state.isFocusVisible}
              // data-focus-visible is part of react aria components spec
              // and is used in Table to handle focus states
              data-focus-visible={state.isFocusVisible}
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
                <Checkmark aria-hidden>
                  <Icon
                    name={state.isIndeterminate ? 'remove' : 'check'}
                    size={14}
                    color="currentColor"
                  />
                </Checkmark>
              )}
            </CheckmarkWrapper>

            {!!label && (
              <CheckmarkLabel data-required={rest.isRequired}>
                {label}
              </CheckmarkLabel>
            )}
          </Content>
        );
      }}
    </Wrapper>
  );
}

const Wrapper = styled(AriaCheckbox, {
  base: {
    display: 'flex',
  },
});

const Content = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '$xs',
  },
});

const CheckmarkWrapper = styled('div', {
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

const Checkmark = styled('div', {
  base: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    $fadeScaleIn: '200ms',
  },
});

const CheckmarkLabel = styled('span', {
  base: {
    textStyle: '$body',
    lineHeight: 1,
    color: '$text',

    '&[data-required="true"]': {
      '&:after': {
        content: '" *"',
        color: '$error',
      },
    },
  },
  variants: {
    labelPosition: {
      right: {},
      left: {
        width: 'var(--label-width, auto)',
        textAlign: 'right',
      },
    },
  },
});
