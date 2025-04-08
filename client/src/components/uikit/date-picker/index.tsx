import { parseDate } from '@internationalized/date';
import { useLingui } from '@lingui/react/macro';
import { capitalize } from 'lodash';
import { type Ref, useState } from 'react';
import {
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  DateInput as AriaDateInput,
  DatePicker as AriaDatePicker,
  Calendar,
  CalendarGridBody,
  CalendarGridHeader,
  type DatePickerProps,
  DateSegment,
  type DateValue,
  Dialog,
  Group,
  Popover,
} from 'react-aria-components';

import { useEventListener } from '~/hooks/use-event-listener';
import { cx } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';

import { Button } from '../button';
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
import { toast } from '../toaster';
import { CalendarMonthGrid } from './calendar-month-grid';
import { CalendarYearGrid } from './calendar-year-grid';

type Props = FormComponentProps<DatePickerProps<DateValue>> & {
  ref?: Ref<HTMLDivElement>;
  clearable?: boolean;
  copiable?: boolean;
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
  clearable,
  copiable,
  value,
  onChange,
  ...rest
}: Props) {
  const { t, i18n } = useLingui();
  const inputContext = useInputContext();
  const labelPosition = labelPositionProp ?? inputContext.labelPosition;
  const validation = getValidationParams(validationMessage);
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day');
  const [focused, setFocused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  function handleCopyToClipboard() {
    setCopied(true);
    try {
      const valueInCopyFormat = valueToCopyFormat(value ?? '');
      navigator.clipboard.writeText(valueInCopyFormat);
    } catch (e) {
      console.error(e);
      toast(t`Could not copy date`, { icon: 'error' });
    } finally {
      setTimeout(() => setCopied(false), 2000);
    }
  }

  useEventListener({
    event: 'paste',
    handler: (e: ClipboardEvent) => {
      let clipboardText: string | undefined;
      try {
        clipboardText = e.clipboardData?.getData('text');
        if (!clipboardText) throw new Error();

        const parsed = parseInputDate(clipboardText);
        if (!parsed) throw new Error();

        onChange?.(parsed);
      } catch (e) {
        console.error(e);
        toast(t`Could not paste "${clipboardText}" as a date`, {
          icon: 'error',
        });
      }
    },
    enabled: focused,
    ref: window.document,
  });

  useEventListener({
    event: 'copy',
    handler: () => {
      handleCopyToClipboard();
    },
    enabled: focused,
    ref: window.document,
  });

  return (
    <AriaDatePicker
      {...rest}
      aria-labelledby={labelledby}
      aria-label={hiddenLabel}
      ref={ref}
      isInvalid={validation.type === 'error'}
      granularity="day"
      value={value ? parseDate(value) : null}
      onChange={date => {
        if (date) onChange?.(date.toString());
        setViewMode('day');
        setIsOpen(false);
      }}
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={() => {
        setFocused(false);
      }}
      className={cx(inputWrapperStyles({ labelPosition }), rest.className)}
    >
      <InputLayout
        label={label}
        labelPosition={labelPosition}
        isRequired={rest.isRequired}
        description={description}
        validation={validation}
      >
        <DateInputContainer className={inputBaseStyles()}>
          <DateInput data-testid="date-picker-input">
            {segment => <DateInputSegment segment={segment} />}
          </DateInput>
          {clearable && value && (
            <IconButton
              icon="close"
              label={t`Clear date`}
              size={24}
              slot={null} // Explicit null slot disables RAC props from parent -> doesn't open the dialog
              onPress={() => {
                onChange?.('');
              }}
            />
          )}
          {copiable && value && (
            <IconButton
              icon={copied ? 'check' : 'copy'}
              color={copied ? 'success' : 'neutral'}
              label={copied ? t`Copied to clipboard` : t`Copy date`}
              size={24}
              slot={null} // Explicit null slot disables RAC props from parent -> doesn't open the dialog
              onPress={() => {
                handleCopyToClipboard();
              }}
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

      <DatePickerPopover
        data-testid="date-picker-popover"
        isOpen={isOpen}
        onOpenChange={isOpen => {
          setIsOpen(isOpen);
          if (!isOpen) setViewMode('day');
        }}
      >
        <DatePickerDialog>
          <Calendar firstDayOfWeek="mon" data-testid="date-picker-calendar">
            {date => (
              <>
                <CalendarHeader>
                  <Stack gap="$xxs">
                    <CalendarStateButton
                      onClick={() =>
                        setViewMode(p => (p === 'month' ? 'day' : 'month'))
                      }
                    >
                      <Stack gap="$xxs" align="center">
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
                      <Stack gap="$xxs" align="center">
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
                    <Stack direction="row" gap="$xxs">
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
          </Calendar>
        </DatePickerDialog>
      </DatePickerPopover>
    </AriaDatePicker>
  );
}

function parseInputDate(input: string): string | null {
  const patterns = [
    /^(\d{1,2})[./](\d{1,2})[./](\d{4})$/, // 1.3.2024 or 1/3/2024
    /^(\d{4})-(\d{2})-(\d{2})$/, // 2024-03-01
    /^(\d{4})(\d{2})(\d{2})$/, // 20240301
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      let day: string | undefined;
      let month: string | undefined;
      let year: string | undefined;

      /**
       * The first return value of .match() is the input string.
       * All other values are mapped to corresponding variables based on the pattern.
       */
      if (pattern === patterns[0]) {
        [, day, month, year] = match;
      } else if (pattern === patterns[1]) {
        [, year, month, day] = match;
      } else if (pattern === patterns[2]) {
        [, year, month, day] = match;
      }

      if (!year || !month || !day) return null;

      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }
  return null;
}

// Parses value (2024-01-01) to copy format (1.1.2024)
function valueToCopyFormat(value: string) {
  const [year, month, day] = value.split('-');

  const formattedMonth = Number(month) < 10 ? month?.slice(1) : month;
  const formattedDay = Number(day) < 10 ? day?.slice(1) : day;

  return `${formattedDay}.${formattedMonth}.${year}`;
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
    alignItems: 'center',

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
      cursor: 'not-allowed',
    },

    '&[data-outside-month]': {
      display: 'none',
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
