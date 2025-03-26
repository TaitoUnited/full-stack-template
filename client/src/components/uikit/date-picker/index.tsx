import { parseDate } from '@internationalized/date';
import { type Ref } from 'react';
import {
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  DateInput as AriaDateInput,
  DatePicker as AriaDatePicker,
  Button,
  Calendar,
  CalendarGridBody,
  CalendarGridHeader,
  type DatePickerProps,
  DateSegment,
  type DateValue,
  Dialog,
  Group,
  Heading,
  Label,
  Popover,
} from 'react-aria-components';

import { cx } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';

import { Icon } from '../icon';
import {
  type FormComponentProps,
  inputBaseStyles,
  inputWrapperStyles,
  labelContainerStyles,
  useInputContext,
} from '../partials/common';
import { InputLayout } from '../partials/input-layout';
import { getValidationParams } from '../partials/validation';
import { Stack } from '../stack';

type Props = FormComponentProps<DatePickerProps<DateValue>> & {
  ref?: Ref<HTMLDivElement>;
};

/**
 * Date picker component
 *
 * @ref https://react-spectrum.adobe.com/react-aria/DatePicker.html
 *
 * @prop value - Date string in format: yyyy-mm-dd
 * @prop onChange - Callback for new value, format: yyyy-mm-dd
 */
export function DatePicker({
  ref,
  label,
  labelledby,
  hiddenLabel,
  labelPosition: labelPositionProp,
  description,
  validationMessage,
  value,
  onChange,
  ...rest
}: Props) {
  const inputContext = useInputContext();
  const labelPosition = labelPositionProp ?? inputContext.labelPosition;
  const validation = getValidationParams(validationMessage);

  return (
    <AriaDatePicker
      {...rest}
      aria-labelledby={labelledby}
      aria-label={hiddenLabel}
      ref={ref}
      isInvalid={!!validationMessage}
      granularity="day"
      value={value ? parseDate(value) : null}
      onChange={date => date && onChange?.(date.toString())}
      className={cx(inputWrapperStyles({ labelPosition }), rest.className)}
    >
      {!!label && (
        <Label
          className={labelContainerStyles({ labelPosition })}
          data-required={rest.isRequired}
        >
          {label}
        </Label>
      )}

      <InputLayout description={description} validation={validation}>
        <DateInputContainer className={inputBaseStyles()}>
          <DateInput data-testid="date-picker-input">
            {segment => <DateInputSegment segment={segment} />}
          </DateInput>
          <DateInputButton data-testid="date-picker-input-button">
            <Icon name="calendarMonth" color="textMuted" size={18} />
          </DateInputButton>
        </DateInputContainer>
      </InputLayout>

      <DatePickerPopover data-testid="date-picker-popover">
        <DatePickerDialog>
          <Calendar data-testid="date-picker-calendar">
            <CalendarHeader>
              <CalendarHeading />
              <Stack direction="row" gap="$xs">
                <CalendarHeaderButton
                  slot="previous"
                  data-testid="date-picker-calendar-previous"
                >
                  <Icon name="chevronLeft" color="textMuted" size={24} />
                </CalendarHeaderButton>
                <CalendarHeaderButton
                  slot="next"
                  data-testid="date-picker-calendar-next"
                >
                  <Icon name="chevronRight" color="textMuted" size={24} />
                </CalendarHeaderButton>
              </Stack>
            </CalendarHeader>

            <CalendarGrid>
              <CalendarGridHeader>
                {day => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
              </CalendarGridHeader>
              <CalendarGridBody>
                {date => (
                  <CalendarCell
                    date={date}
                    data-testid="date-picker-calendar-cell"
                  />
                )}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </DatePickerDialog>
      </DatePickerPopover>
    </AriaDatePicker>
  );
}

const DateInputContainer = styled(Group, {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '$xs',

    '&:has([data-focused])': {
      $focusRing: true,
    },

    '&:has([aria-expanded="true"])': {
      $focusRing: true,
    },
  },
});

const DateInputButton = styled(Button, {
  base: {
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '$small',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 150ms',

    '&[data-hovered]': {
      backgroundColor: '$neutral5',
    },

    '&[data-pressed]': {
      opacity: 0.8,
    },

    '&[data-focus-visible]': {
      $focusRing: true,
    },
  },
});

const DateInput = styled(AriaDateInput, {
  base: {
    display: 'flex',
    flexGrow: 1,
  },
});

const DateInputSegment = styled(DateSegment, {
  base: {
    padding: '0px 1px',
    textStyle: '$body',
    color: '$text',
    lineHeight: 1,

    '&[data-placeholder]': {
      color: '$textMuted',
    },

    '&[data-focused]': {
      color: '$textOnContrastingBg',
      backgroundColor: '$primary',
      // Extend the bg without changing the layout size
      outline: '2px solid token($colors.primary)',
    },
  },
});

const DatePickerPopover = styled(Popover, {
  base: {
    '&[data-entering]': {
      $fadeFromTop: '150ms ease-out',
    },
    '&[data-exiting]': {
      $fadeOut: '100ms ease-in',
    },
  },
});

const DatePickerDialog = styled(Dialog, {
  base: {
    backgroundColor: '$surface',
    padding: '$regular',
    borderRadius: '$regular',
    border: '1px solid rgba(0, 0, 0, 0.15)', // blend with shadow
    boxShadow: '$regular',
  },
});

const CalendarHeader = styled('header', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '$xs',
    marginBottom: '$regular',
    paddingLeft: '$xs',
    paddingRight: '$xs',
  },
});

const CalendarHeaderButton = styled(Button, {
  base: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '$full',
    transition: 'opacity 150ms, background-color 100ms',

    '&[data-hovered]': {
      backgroundColor: '$neutral5',
    },
    '&[data-pressed]': {
      opacity: 0.8,
    },
    '&[data-focus-visible]': {
      $focusRing: true,
    },
  },
});

const CalendarHeading = styled(Heading, {
  base: {
    textStyle: '$headingM',
    lineHeight: 1,
  },
});

const CalendarGrid = styled(AriaCalendarGrid, {
  base: {
    borderCollapse: 'collapse',
    borderSpacing: '2px',
  },
});

const cellSize = 32;

const CalendarHeaderCell = styled(AriaCalendarHeaderCell, {
  base: {
    textStyle: '$overlineRegular',
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    margin: '4px',
    color: '$textMuted',
  },
});

const CalendarCell = styled(AriaCalendarCell, {
  base: {
    textStyle: '$body',
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    margin: '4px',
    borderRadius: '$full',
    color: '$text',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    cursor: 'default',
    transition: 'opacity 150ms, background-color 100ms',

    '&[data-disabled]': {
      color: '$neutral2',
    },

    '&[data-selected]': {
      backgroundColor: '$primary',
      color: '$textOnContrastingBg',
      textStyle: '$bodySemiBold',
    },

    '&[data-hovered="true"]:not([data-unavailable], [data-selected])': {
      backgroundColor: '$neutral4',
      color: '$text',
      textStyle: '$bodySemiBold',
    },

    '&[data-pressed]:not([data-selected])': {
      backgroundColor: '$neutral3',
    },

    '&[data-unavailable]:not([data-selected])': {
      color: '$neutral2',
      textDecoration: 'line-through',
      cursor: 'not-allowed',
    },

    '&[data-focus-visible]': {
      $focusRing: true,
    },
  },
});
