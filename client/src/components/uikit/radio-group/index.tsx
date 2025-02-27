import { type Ref } from 'react';
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps,
} from 'react-aria-components';

import { cx } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';

import {
  type FormComponentProps,
  inputWrapperStyles,
  useInputContext,
} from '../partials/common';
import { InputLayout } from '../partials/input-layout';
import { getValidationParams } from '../partials/validation';
import { Stack } from '../stack';

type Option = {
  value: string;
  label: string;
};

type Props = FormComponentProps<RadioGroupProps> & {
  ref?: Ref<HTMLDivElement>;
  options: Option[];
};

export function RadioGroup({
  ref,
  options,
  label,
  labelledby,
  hiddenLabel,
  labelPosition: labelPositionProp,
  validationMessage,
  description,
  ...rest
}: Props) {
  const inputContext = useInputContext();
  const labelPosition = labelPositionProp ?? inputContext.labelPosition;
  const validation = getValidationParams(validationMessage);

  return (
    <AriaRadioGroup
      ref={ref}
      className={cx(inputWrapperStyles({ labelPosition }), rest.className)}
      isInvalid={validation.type === 'error'}
      aria-labelledby={labelledby}
      aria-label={hiddenLabel}
      {...rest}
    >
      <InputLayout
        label={label}
        labelPosition={labelPosition}
        isRequired={rest.isRequired}
        description={description}
        validation={validation}
      >
        <Stack direction="column" gap="xs">
          {options.map(option => (
            <Radio
              key={option.value}
              value={option.value}
              data-value={option.value} // for E2E testing
            >
              {state => (
                <>
                  <IconWrapper
                    selected={state.isSelected}
                    hovered={state.isHovered}
                  >
                    <IconInner selected={state.isSelected} />
                  </IconWrapper>
                  {option.label}
                </>
              )}
            </Radio>
          ))}
        </Stack>
      </InputLayout>
    </AriaRadioGroup>
  );
}

const Radio = styled(AriaRadio, {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '$xs',
    width: 'max-content',
    padding: '$xxs',
    paddingRight: '$regular',
    textStyle: '$body',
    borderRadius: '$full',
    lineHeight: 0,

    '&[data-focus-visible]': {
      $focusRing: true,
    },

    '&[data-disabled]': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

const IconWrapper = styled('span', {
  base: {
    display: 'grid',
    placeItems: 'center',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: '$line1',
  },
  variants: {
    selected: {
      true: {
        borderColor: '$primary',
      },
    },
    // TODO: Is invalid even needed in radiogroups anywhere?
    // invalid: {
    //   true: {
    //     borderColor: '$errorContrast',
    //     backgroundColor: '$errorMuted',
    //   },
    // },
    hovered: {
      true: {
        backgroundColor: '$elevatedHover',
      },
    },
  },
});

const IconInner = styled('span', {
  base: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '$primary',
    scale: 0,
    transition: 'scale 150ms ease-out, border-color 150ms ease-out',
  },
  variants: {
    selected: {
      true: {
        backgroundColor: '$primary',
        scale: 1,
      },
    },
    invalid: {
      true: {
        backgroundColor: '$errorContrast',
      },
    },
  },
});
