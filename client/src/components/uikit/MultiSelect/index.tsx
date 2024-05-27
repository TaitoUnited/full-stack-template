import { forwardRef, useContext, useState } from 'react';
import { useMeasure } from 'react-use';
import { Trans, t } from '@lingui/macro';
import { VisuallyHidden, useFilter } from 'react-aria';

import {
  Button as AriaButton,
  ButtonProps,
  Dialog,
  DialogTrigger,
  Label,
  ListBox,
  ListBoxItem,
  OverlayTriggerStateContext,
  Popover,
} from 'react-aria-components';

import {
  DescriptionText,
  ErrorText,
  SelectedIcon,
  inputBaseStyles,
  inputIconLeftStyles,
  inputIconRightStyles,
  inputWrapperStyles,
  labelStyles,
  listBoxItemStyles,
  listBoxStyles,
} from '../partials/common';

import { Icon, IconName } from '../Icon';
import { FillButton } from '../Buttons/FillButton';
import { OutlineButton } from '../Buttons/OutlineButton';
import { IconButton } from '../Buttons/IconButton';
import { Text } from '../Text';
import { Stack, styled } from '~styled-system/jsx';
import { css, cx } from '~styled-system/css';

export type MultiSelectOption = {
  value: string;
  label: string;
};

type CommonProps = {
  items: MultiSelectOption[];
  /**
   * Whether to show the confirmation footer and require the user take an action
   * to apply the selection. If not provided, the selection is applied immediately
   * when the user selects an option.
   */
  isConfirmationRequired?: boolean;
  /**
   * Passing an `errorMessage` as prop toggles the input as invalid.
   */
  errorMessage?: string;
  description?: string;
  icon?: IconName;
  selected: Set<string>;
  onSelect: (value: Set<string>) => void;
};

type Props = ButtonProps &
  CommonProps & {
    label?: string;
    isRequired?: boolean;
    placeholder?: string;
  };

/**
 * This `MultiSelect` component can be used to select multiple options from
 * a list of **static** options.
 * 
 * For selecting a single option, use the regular `Select` component. If you
 * need to load options asynchronously, use the `AsyncSelect` component instead.
 * The `AsyncSelect` component supports both single and multiple selection modes.
 */
export const MultiSelect = forwardRef<HTMLButtonElement, Props>(
  (
    {
      label,
      icon,
      isRequired,
      isConfirmationRequired,
      errorMessage,
      description,
      placeholder = '',
      items,
      selected,
      onSelect,
      ...rest
    },
    ref
  ) => {
    const [measureRef, dimensions] = useMeasure<HTMLDivElement>();

    return (
      <DialogTrigger>
        <div className={inputWrapperStyles}>
          <Label className={labelStyles} data-required={isRequired}>
            {label}
          </Label>

          <ButtonWrapper ref={measureRef}>
            {!!icon && (
              <Icon
                name={icon}
                size={20}
                color="neutral1"
                className={inputIconLeftStyles}
              />
            )}

            <AriaButton
              {...rest}
              ref={ref}
              data-invalid={!!errorMessage}
              data-has-icon={!!icon}
              data-has-selected={selected.size > 0}
              className={cx(
                inputBaseStyles,
                css({
                  paddingRight: '$xl!',
                  color: '$textMuted',
                  $truncate: true,
                  '&[data-has-icon="true"]': { paddingLeft: '$xl' },
                  '&[data-has-selected="true"]': { color: '$text' },
                })
              )}
            >
              {selected.size === 0 ? placeholder : t`${selected.size} selected`}
            </AriaButton>

            <Icon
              name="arrowDropDown"
              size={24}
              color="text"
              className={cx(inputIconRightStyles, css({ right: '$xs!' }))}
            />
          </ButtonWrapper>

          {!!description && <DescriptionText>{description}</DescriptionText>}
          {!!errorMessage && <ErrorText>{errorMessage}</ErrorText>}

          <Popover
            data-test-id="multi-select-popover"
            placement="bottom start"
            /**
             * With some components React Aria would automatically provide this
             * CSS variable, but since we're using a custom component we need to
             * provide it ourselves.
             */
            style={{ '--trigger-width': `${dimensions.width}px` }}
            offset={4}
          >
            <MultiSelectOptions
              items={items}
              isConfirmationRequired={isConfirmationRequired}
              errorMessage={errorMessage}
              selected={selected}
              onSelect={onSelect}
            />
          </Popover>
        </div>
      </DialogTrigger>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';

function MultiSelectOptions({
  isConfirmationRequired,
  items,
  selected,
  onSelect,
}: CommonProps) {
  const [inputValue, setInputValue] = useState('');
  const allowFiltering = items.length > 10;
  const { contains } = useFilter({ sensitivity: 'base' });
  const visibleItems = allowFiltering
    ? items.filter(item => contains(item.label, inputValue.trim()))
    : items;

  return (
    <MultiSelectDialog className={listBoxStyles}>
      {items.length > 10 && (
        <MultiSelectFilter>
          <VisuallyHidden>
            <Trans>Filter options</Trans>
          </VisuallyHidden>

          <Icon name="search" size={20} color="textMuted" />

          <MultiSelectFilterInput
            autoFocus
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            data-test-id="multi-select-input"
          />

          {inputValue.length > 0 && (
            <IconButton
              icon="close"
              size={24}
              label={t`Clear search filter`}
              onClick={() => setInputValue('')}
              data-test-id="multi-select-input-clear"
            />
          )}
        </MultiSelectFilter>
      )}

      <MultiSelectOptionsList
        items={visibleItems}
        isConfirmationRequired={isConfirmationRequired}
        selected={selected}
        onSelect={onSelect}
      />
    </MultiSelectDialog>
  );
}

/**
 * NOTE: Keep internal state inside this component so that it is automatically
 * reset when the popover is closed! That way we don't need to do any manual
 * state synchronization and cleanup.
 */
function MultiSelectOptionsList({
  isConfirmationRequired = false,
  items,
  selected,
  onSelect,
}: CommonProps) {
  const triggerState = useContext(OverlayTriggerStateContext);
  const [internalSelected, setInternalSelected] = useState(selected);
  const selectedOptions = isConfirmationRequired ? internalSelected : selected;

  function handleSelect(value: CommonProps['selected']) {
    if (isConfirmationRequired) {
      setInternalSelected(value);
    } else {
      onSelect(value);
    }
  }

  function handleClear() {
    onSelect(new Set());
    triggerState.close();
  }

  function handleConfirm() {
    onSelect(internalSelected);
    triggerState.close();
  }

  return (
    <>
      <MultiSelectItems
        items={items}
        selectionMode="multiple"
        selectedKeys={selectedOptions}
        onSelectionChange={handleSelect}
        data-test-id="multi-select-options"
        renderEmptyState={() => (
          <MultiSelectEmpty>
            <Text variant="body">
              <Trans>No matching options.</Trans>
            </Text>
          </MultiSelectEmpty>
        )}
      >
        {(option: MultiSelectOption) => (
          <ListBoxItem
            key={option.value}
            id={option.value}
            textValue={option.label}
            className={listBoxItemStyles}
            data-test-id="multi-select-option"
          >
            <Stack
              direction="row"
              gap="$small"
              align="center"
              justify="space-between"
            >
              {option.label}
              <SelectedIcon />
            </Stack>
          </ListBoxItem>
        )}
      </MultiSelectItems>

      {isConfirmationRequired && (
        <MultiSelectConfirmation>
          <OutlineButton
            variant="info"
            onClick={handleClear}
            data-test-id="multi-select-clear"
          >
            <Trans>Clear</Trans>
          </OutlineButton>

          <FillButton
            variant="primary"
            onClick={handleConfirm}
            data-test-id="multi-select-confirm"
          >
            <Trans>Confirm</Trans>
          </FillButton>
        </MultiSelectConfirmation>
      )}
    </>
  );
}

const ButtonWrapper = styled('div', {
  base: {
    position: 'relative',
  },
});

const MultiSelectDialog = styled(Dialog, {
  base: {
    outline: 'none',
  },
});

const MultiSelectItems = styled(ListBox, {
  base: {
    outline: 'none',
    maxHeight: '400px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
});

const MultiSelectEmpty = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100px',
    padding: '$small',
    textAlign: 'center',
  },
});

const MultiSelectFilter = styled('label', {
  base: {
    '--outline-width': '1px',
    padding: '$small',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px', // try to match container border radius
    borderWidth: '1px',
    borderColor: '$line1',
    outlineOffset: 'calc(0px - var(--outline-width))',
    marginBottom: '$xs',

    '&:focus-within': {
      '--outline-width': '2px',
      borderColor: 'transparent',
      outline: 'var(--outline-width) solid token($colors.focusRing)',
    },
  },
});

const MultiSelectFilterInput = styled('input', {
  base: {
    flex: 1,
    marginLeft: '$xs',
    marginRight: '$small',
    textStyle: '$body',
    textAlign: 'left',
  },
});

const MultiSelectConfirmation = styled('div', {
  base: {
    marginTop: '$xs',
    display: 'flex',
    justifyContent: 'space-evenly',
    gap: '$xs',

    '& button': {
      flex: 1,
    },
  },
});
