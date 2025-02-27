import { useLingui } from '@lingui/react/macro';
import { type KeyboardEvent, useId, useRef, useState } from 'react';
import type { ComboBoxProps } from 'react-aria-components';
import {
  Button,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
} from 'react-aria-components';
import { mergeRefs } from 'react-merge-refs';
import useMeasure from 'react-use-measure';

import { useDetectOutsideClick } from '~/hooks/use-detect-outside-click';
import { useKeyPressEvent } from '~/hooks/use-key-press';
import { css, cx } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';

import { Chip } from '../chip';
import { Icon, type IconName } from '../icon';
import { IconButton } from '../icon-button';
import type { FormComponentProps } from '../partials/common';
import {
  inputBaseStyles,
  inputIconLeftStyles,
  inputWrapperStyles,
  listBoxItemStyles,
  listBoxStyles,
  useInputContext,
} from '../partials/common';
import { InputLayout } from '../partials/input-layout';
import { SelectItem } from '../partials/select-item';
import { getValidationParams } from '../partials/validation';

type Option = {
  value: string;
  label: string;
  description?: string;
};

type Props = Pick<
  FormComponentProps<ComboBoxProps<Option>>,
  | 'label'
  | 'labelPosition'
  | 'labelledby'
  | 'hiddenLabel'
  | 'description'
  | 'validationMessage'
  | 'placeholder'
  | 'isRequired'
  | 'isDisabled'
  | 'id'
  | 'className'
> & {
  icon?: IconName;
  items: Option[];
  value: string[];
  onChange: (value: string[]) => void;
};

/**
 * MultiSelectCombobox
 *
 * Custom combobox implementation with multiple selection as chips
 *
 * TODO: Use collection hooks from React Aria to enable virtual focus for Listbox
 */
export function MultiSelectCombobox({
  label,
  labelPosition: labelPositionProp,
  labelledby,
  hiddenLabel,
  description,
  validationMessage,
  placeholder,
  icon,
  value,
  onChange,
  items,
  className,
  isDisabled,
  isRequired,
  id,
}: Props) {
  const { t } = useLingui();
  const inputId = useId();
  const inputContext = useInputContext();
  const labelPosition = labelPositionProp ?? inputContext.labelPosition;
  const [measureRef, dimensions] = useMeasure();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const validation = getValidationParams(validationMessage);

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.code) {
      // Select first option on Enter when searching
      case 'Enter':
        if (
          !!inputValue &&
          filteredItems[0] &&
          !value.includes(filteredItems[0].value)
        ) {
          addValue(filteredItems[0].value);
          setInputValue('');
        }
        break;
      // Clear last value on Backspace or all values on ctrl/cmd + Backspace
      case 'Backspace':
        if (!inputValue) {
          // If a modifier key is held, remove all, otherwise remove last
          if (event.ctrlKey || event.metaKey) {
            onChange([]);
          } else {
            onChange(value.slice(0, -1));
          }
        }
        break;
    }
  }

  function removeValue(val: string) {
    onChange(value.filter(v => v !== val));
  }

  function addValue(val: string) {
    // Add value but keep their order related to items list
    onChange(
      items
        .filter(v => value.includes(v.value) || v.value === val)
        .map(o => o.value)
    );
  }

  const filteredItems =
    items?.filter(o =>
      o.label.toLowerCase().includes(inputValue.toLowerCase())
    ) ?? [];

  useDetectOutsideClick({
    ref: [wrapperRef, listBoxRef],
    enabled: dialogOpen,
    handler: () => {
      setDialogOpen(false);
    },
  });

  useKeyPressEvent({
    key: 'Escape',
    enabled: dialogOpen,
    capture: true,
    handler: () => {
      setDialogOpen(false);
    },
  });

  return (
    <div className={cx(inputWrapperStyles({ labelPosition }), className)}>
      <InputLayout
        label={label}
        labelPosition={labelPosition}
        isRequired={isRequired}
        description={description}
        validation={validation}
      >
        <InputBase
          className={inputBaseStyles({
            invalidVisible: validation.position === 'below',
          })}
          // eslint-disable-next-line react-compiler/react-compiler
          ref={mergeRefs([measureRef, wrapperRef])}
          hasIcon={!!icon}
          aria-invalid={validation.type === 'error'}
          onClick={() => {
            if (!isDisabled) {
              setDialogOpen(true);
              inputRef.current?.focus();
            }
          }}
        >
          {!!icon && (
            <Icon
              name={icon}
              size={20}
              color="neutral1"
              className={inputIconLeftStyles}
            />
          )}
          {value.map(option => (
            <Chip
              key={option}
              removable
              onRemove={() => {
                removeValue(option);
              }}
            >
              {items?.find(o => o.value === option)?.label}
            </Chip>
          ))}
          <Input
            placeholder={placeholder ?? t`Type to search`}
            id={id ?? inputId}
            aria-labelledby={labelledby}
            aria-label={hiddenLabel}
            className={inputStyles}
            ref={inputRef}
            disabled={isDisabled}
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value);
              setDialogOpen(true);
            }}
            onKeyDown={onKeyDown}
          />
          <InputDecorations>
            {value.length > 0 && (
              <IconButton
                label={t`Clear`}
                icon="close"
                size="small"
                onPress={() => {
                  setInputValue('');
                  onChange([]);
                  setDialogOpen(false);
                }}
              />
            )}
            <ChevronButton
              onPress={() => {
                setDialogOpen(!dialogOpen);
              }}
              isDisabled={isDisabled}
            >
              <Icon
                name={dialogOpen ? 'arrowDropUp' : 'arrowDropDown'}
                color={isDisabled ? 'textDisabled' : 'text'}
                size={24}
              />
            </ChevronButton>
          </InputDecorations>
        </InputBase>
      </InputLayout>

      <Popover
        isOpen={dialogOpen}
        triggerRef={wrapperRef}
        placement="bottom start"
        isNonModal
        style={{ '--trigger-width': `${dimensions.width}px` }}
        offset={4}
      >
        <ListBox
          className={listBoxStyles}
          items={filteredItems}
          ref={listBoxRef}
          aria-label={t`Search results`}
          selectionMode="multiple"
          onSelectionChange={val => {
            // Replace with all new values but keep their order related to items list
            const newSelectedItems = items
              ?.filter(o => [...val].includes(o.value))
              .map(o => o.value);
            onChange(newSelectedItems);
          }}
          selectedKeys={value}
          renderEmptyState={() => (
            <div className={listBoxItemStyles}>
              <SelectItem label={t`No results found.`} />
            </div>
          )}
        >
          {(option: Option) => (
            <ListBoxItem
              id={option.value}
              textValue={option.label}
              className={listBoxItemStyles}
            >
              <SelectItem
                label={option.label}
                description={option.description}
              />
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </div>
  );
}

const InputBase = styled('div', {
  base: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '$xs',
    paddingRight: '!$4xl',
    '&:focus-within': {
      $focusRing: true,
    },
  },
  variants: {
    hasIcon: {
      true: {
        paddingLeft: '!$2xl',
      },
    },
  },
});

const InputDecorations = styled('div', {
  base: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '$xs',
    padding: '$xs',
  },
});

const ChevronButton = styled(Button, {
  base: {
    height: '100%',
    paddingInline: '!$xxs',
    display: 'flex',
    alignItems: 'center',
    cursor: 'inherit',
  },
});

const inputStyles = css({
  width: '100%',
  cursor: 'inherit',
});
