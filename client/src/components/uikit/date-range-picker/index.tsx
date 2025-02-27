import { useLingui } from '@lingui/react/macro';
import { capitalize } from 'lodash';
import { type Ref, useCallback, useState } from 'react';
import {
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  DateInput as AriaDateInput,
  DateRangePicker as AriaDateRangePicker,
  CalendarGridBody,
  CalendarGridHeader,
  type DateRange,
  type DateRangePickerProps,
  DateSegment,
  type DateValue,
  Dialog,
  Group,
  Popover,
  RangeCalendar,
} from 'react-aria-components';

import { cx } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';
import { sleep } from '~/utils/promise';

import { Button } from '../button';
import { CalendarMonthGrid } from '../date-picker/calendar-month-grid';
import { CalendarYearGrid } from '../date-picker/calendar-year-grid';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import {
  type FormComponentProps,
  inputBaseStyles,
  inputWrapperStyles,
  useInputContext,
} from '../partials/common';
import { InputLayout } from '../partials/input-layout';
import { getValidationParams } from '../partials/validation';
import { Stack } from '../stack';
import { Text } from '../text';
import { PredefinedRanges } from './predefined-ranges';

type DateRangePicker<T extends DateValue> = Omit<
  FormComponentProps<DateRangePickerProps<T>>,
  'value' | 'onChange'
> & {
  ref?: Ref<HTMLDivElement>;
  clearable?: boolean;
  preDefinable?: boolean;
  value: DateRange | null;
  onChange?: (value: DateRange | null) => void;
};

/**
 * DateRangePicker component
 *
 * @ref https://react-spectrum.adobe.com/react-aria/DateRangePicker.html
 *
 * @template T - The type of the date value.
 *
 * @prop {DateRange | null} value - The current value of the date range picker, format of the dates: yyyy-mm-dd
 * @prop {(value: DateRange | null) => void} onChange - Callback for when the date range changes, format of the dates: yyyy-mm-dd
 */
export function DateRangePicker<T extends DateValue>({
  ref,
  label,
  labelledby,
  hiddenLabel,
  labelPosition: labelPositionProp,
  description,
  validationMessage,
  clearable = false,
  preDefinable = false,
  value,
  onChange,
  ...rest
}: DateRangePicker<T>) {
  const { t, i18n } = useLingui();
  const inputContext = useInputContext();
  const labelPosition = labelPositionProp ?? inputContext.labelPosition;
  const validation = getValidationParams(validationMessage);
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day');
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = useCallback(
    (dateRange: DateRange | null) => {
      if (dateRange) {
        onChange?.(dateRange);
      }
      setViewMode('day');
      setIsOpen(false);
    },
    [onChange]
  );

  const handlePopoverStateChange = useCallback((isOpen: boolean) => {
    setIsOpen(isOpen);
    if (!isOpen) setViewMode('day');
  }, []);

  const onSelectRange = useCallback(
    async (range: DateRange) => {
      onChange?.(range);
      await sleep(250);
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <AriaDateRangePicker
      {...rest}
      aria-labelledby={labelledby}
      aria-label={hiddenLabel}
      ref={ref}
      isInvalid={validation.type === 'error'}
      granularity="day"
      value={value}
      onChange={handleDateChange}
      className={cx(inputWrapperStyles({ labelPosition }), rest.className)}
    >
      <InputLayout
        label={label}
        labelPosition={labelPosition}
        isRequired={rest.isRequired}
        description={description}
        validation={validation}
      >
        <DateInputContainer
          className={inputBaseStyles({
            invalidVisible: validation.position === 'below',
          })}
        >
          <Stack gap="xxs" align="center">
            <DateInput data-testid="date-range-picker-input-start" slot="start">
              {segment => <DateInputSegment segment={segment} />}
            </DateInput>
            <Text variant="body" as="span">
              {' - '}
            </Text>
            <DateInput data-testid="date-range-picker-input-end" slot="end">
              {segment => <DateInputSegment segment={segment} />}
            </DateInput>
          </Stack>
          {clearable && value && (
            <IconButton
              icon="close"
              label={t`Clear date`}
              size={24}
              slot={null} // Explicit null slot disables RAC props from parent -> doesn't open the dialog
              onPress={() => onChange?.(null)}
            />
          )}
          <IconButton
            data-testid="date-picker-input-button"
            icon="calendarMonth"
            label={t`Open date picker`}
            size={24}
            onPress={() => setIsOpen(true)}
          />
        </DateInputContainer>
      </InputLayout>

      <DateRangePickerPopover
        data-testid="date-picker-popover"
        isOpen={isOpen}
        onOpenChange={handlePopoverStateChange}
      >
        <DateRangePickerDialog>
          <Stack gap="regular" direction="row">
            {preDefinable && (
              <PredefinedRanges
                currentRange={value}
                onSelectRange={onSelectRange}
              />
            )}
            <RangeCalendar
              data-testid="date-range-picker-calendar"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {date => (
                <>
                  <CalendarHeader>
                    <Stack gap="xxs">
                      <CalendarStateButton
                        onClick={() =>
                          setViewMode(p => (p === 'month' ? 'day' : 'month'))
                        }
                      >
                        <Stack gap="xxs" align="center">
                          <Text variant="headingM">
                            {capitalize(
                              new Date(
                                0,
                                date.state.focusedDate.month - 1
                              ).toLocaleDateString(i18n.locale, {
                                month: 'long',
                              })
                            )}
                          </Text>
                          <Icon
                            name={
                              viewMode === 'month'
                                ? 'arrowDropUp'
                                : 'arrowDropDown'
                            }
                            size={20}
                            color="text"
                          />
                        </Stack>
                      </CalendarStateButton>
                      <CalendarStateButton
                        onClick={() => {
                          setViewMode(p => (p === 'year' ? 'day' : 'year'));
                        }}
                      >
                        <Stack gap="xxs" align="center">
                          <Text variant="headingM">
                            {new Date(
                              date.state.focusedDate.year,
                              0
                            ).toLocaleDateString(i18n.locale, {
                              year: 'numeric',
                            })}
                          </Text>
                          <Icon
                            name={
                              viewMode === 'year'
                                ? 'arrowDropUp'
                                : 'arrowDropDown'
                            }
                            size={20}
                            color="text"
                          />
                        </Stack>
                      </CalendarStateButton>
                    </Stack>
                    {viewMode === 'day' && (
                      <Stack direction="row" gap="xxs">
                        <CalendarHeaderButton
                          slot="previous"
                          data-testid="date-picker-calendar-previous"
                        >
                          <Icon name="chevronLeft" color="text" size={22} />
                        </CalendarHeaderButton>
                        <CalendarHeaderButton
                          slot="next"
                          data-testid="date-picker-calendar-next"
                        >
                          <Icon name="chevronRight" color="text" size={22} />
                        </CalendarHeaderButton>
                      </Stack>
                    )}
                  </CalendarHeader>

                  {viewMode === 'day' && (
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
                  )}
                  {viewMode === 'month' && (
                    <CalendarMonthGrid
                      state={date.state}
                      onChange={() => setViewMode('day')}
                    />
                  )}
                  {viewMode === 'year' && (
                    <CalendarYearGrid
                      state={date.state}
                      onChange={() => setViewMode('day')}
                    />
                  )}
                </>
              )}
            </RangeCalendar>
          </Stack>
        </DateRangePickerDialog>
      </DateRangePickerPopover>
    </AriaDateRangePicker>
  );
}

const CalendarStateButton = styled('button', {
  base: {
    borderRadius: '$small',
    paddingInlineStart: '$xxs',
    paddingBlock: '$xs',
    '&:hover': {
      backgroundColor: '$neutral5',
    },
    '&:focus-visible': {
      $focusRing: true,
    },
  },
});

const DateInputContainer = styled(Group, {
  base: {
    display: 'flex',
    gap: '$xxs',
    justifyContent: 'space-between',

    '&:has([data-focused])': {
      $focusRing: true,
    },

    '&:has([aria-expanded="true"])': {
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

const DateRangePickerPopover = styled(Popover, {
  base: {
    '&[data-entering]': {
      $fadeFromTop: '150ms ease-out',
    },
    '&[data-exiting]': {
      $fadeOut: '100ms ease-in',
    },
  },
});

const DateRangePickerDialog = styled(Dialog, {
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
    gap: '$xxs',
    marginBottom: '$regular',
    paddingLeft: '$xs',
    paddingRight: '$xs',
    minHeight: '32px',
  },
});

const CalendarHeaderButton = styled(Button, {
  base: {
    width: '32px',
    height: '32px',
    minHeight: 0,
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
      backgroundColor: '$primaryMuted',
    },

    '&[data-selection-start], &[data-selection-end]': {
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
