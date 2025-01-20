import { t } from '@lingui/macro';
import { type Ref, useContext, useState } from 'react';
import { useAsyncList } from 'react-stately';
import useMeasure from 'react-use-measure';

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
  inputBaseStyles,
  inputIconLeftStyles,
  inputIconRightStyles,
  inputWrapperStyles,
  labelStyles,
  listBoxItemStyles,
  listBoxStyles,
} from '../partials/common';

import { SelectActions } from '../partials/SelectActions';
import { SelectFilterInput } from '../partials/SelectFilterInput';
import { SelectItem } from '../partials/SelectItem';
import { Icon, IconName } from '../Icon';
import { Text } from '../Text';
import { Spinner } from '../Spinner';
import { styled } from '~styled-system/jsx';
import { css, cx } from '~styled-system/css';

export type AsyncSelectOption = {
  value: string;
  label: string;
  description?: string;
};

export type AsyncSelectLoadOptions = (state: {
  filterText?: string;
  signal: AbortSignal;
}) => Promise<{ items: AsyncSelectOption[] }>;

type CommonProps = {
  ref?: Ref<HTMLButtonElement>;
  /**
   * Function to load options asynchronously. This function should return a
   * promise that resolves to `{ items: AsyncSelectOption[] }`.
   * The function receives an object with an abort signal and a `search` property
   * that contains he current input value. This function will be initially called
   * with an empty string to load the initial set of options.
   */
  loadItems: AsyncSelectLoadOptions;
  /**
   * Whether to show the actions footer with buttons to confirm or clear the selection.
   */
  actions?: { confirm?: boolean; clear?: boolean };
  /**
   * Text to display when no options are found for the current search value.
   */
  emptyMessage?: string;
  /**
   * Passing an `errorMessage` as prop toggles the input as invalid.
   */
  errorMessage?: string;
  description?: string;
  icon?: IconName;
  selectionMode?: 'single' | 'multiple';
  selected: Set<string>;
  onSelect: (value: Set<string>) => void;
};

type Props = ButtonProps &
  CommonProps & {
    label?: string;
    isRequired?: boolean;
    placeholder?: string;
  };

export function AsyncSelect({
  ref,
  label,
  icon,
  isRequired,
  actions,
  emptyMessage,
  errorMessage,
  description,
  placeholder = '',
  selectionMode,
  selected,
  onSelect,
  loadItems,
  ...rest
}: Props) {
  const [measureRef, dimensions] = useMeasure();

  return (
    <DialogTrigger>
      <div className={inputWrapperStyles}>
        <Label
          className={labelStyles}
          data-required={isRequired}
          data-testid="async-select-label"
        >
          {label}
        </Label>

        <AsyncSelectButton ref={measureRef}>
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
            data-testid="async-select-button"
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
        </AsyncSelectButton>

        {!!description && <DescriptionText>{description}</DescriptionText>}
        {!!errorMessage && <ErrorText>{errorMessage}</ErrorText>}

        <Popover
          data-testid="async-select-popover"
          placement="bottom start"
          /**
           * With some components React Aria would automatically provide this
           * CSS variable, but since we're using a custom component we need to
           * provide it ourselves.
           */
          style={{ '--trigger-width': `${dimensions.width}px` }}
          offset={4}
        >
          <AsyncSelectOptions
            actions={actions}
            emptyMessage={emptyMessage}
            errorMessage={errorMessage}
            selectionMode={selectionMode}
            selected={selected}
            onSelect={onSelect}
            loadItems={loadItems}
          />
        </Popover>
      </div>
    </DialogTrigger>
  );
}

function AsyncSelectOptions({
  errorMessage = t`Something went wrong`,
  emptyMessage = t`No options found`,
  actions,
  selectionMode,
  selected,
  onSelect,
  loadItems,
}: CommonProps) {
  const list = useAsyncList<AsyncSelectOption>({ load: loadItems });

  return (
    <AsyncSelectDialog className={listBoxStyles}>
      <SelectFilterInput
        isLoading={list.loadingState === 'filtering'}
        inputValue={list.filterText}
        onInputChange={list.setFilterText}
      />

      {list.loadingState === 'loading' ? (
        <AsyncSelectEmpty>
          <Spinner size="medium" color="text" />
        </AsyncSelectEmpty>
      ) : list.loadingState === 'error' ? (
        <AsyncSelectEmpty>
          <Text variant="body">{errorMessage}</Text>
        </AsyncSelectEmpty>
      ) : list.loadingState === 'idle' &&
        list.filterText &&
        list.items.length === 0 ? (
        <AsyncSelectEmpty>
          <Text variant="body">{emptyMessage}</Text>
        </AsyncSelectEmpty>
      ) : list.items ? (
        <AsyncSelectOptionsList
          items={list.items}
          emptyMessage={emptyMessage}
          actions={actions}
          selectionMode={selectionMode}
          selected={selected}
          onSelect={onSelect}
        />
      ) : null}
    </AsyncSelectDialog>
  );
}

/**
 * NOTE: Keep internal state inside this component so that it is automatically
 * reset when the popover is closed! That way we don't need to do any manual
 * state synchronization and cleanup.
 */
function AsyncSelectOptionsList({
  actions,
  selectionMode = 'multiple',
  items,
  selected,
  onSelect,
}: Omit<CommonProps, 'loadItems'> & {
  items: AsyncSelectOption[];
}) {
  const triggerState = useContext(OverlayTriggerStateContext);
  const [internalSelected, setInternalSelected] = useState(selected);
  const isConfirmationRequired = Boolean(actions?.confirm);
  const selectedOptions = isConfirmationRequired ? internalSelected : selected;

  // It only makes sense to show the clear button when there are selected options
  const isClearable = Boolean(actions?.clear && selectedOptions.size > 0);

  // Only show the confirm button when there are selected options
  const isConfirmable = Boolean(
    actions?.confirm && (internalSelected.size > 0 || selected.size > 0)
  );

  function handleSelect(value: CommonProps['selected']) {
    if (isConfirmationRequired) {
      setInternalSelected(value);
    } else {
      onSelect(value);
    }
  }

  function handleClear() {
    onSelect(new Set());
    triggerState?.close();
  }

  function handleConfirm() {
    onSelect(internalSelected);
    triggerState?.close();
  }

  return (
    <>
      <ListBox<AsyncSelectOption>
        items={items}
        selectionMode={selectionMode}
        selectedKeys={selectedOptions}
        // We don't support the `'all'` selection value
        onSelectionChange={selection => handleSelect(selection as Set<string>)}
        className={asyncSelectListBoxStyles}
        data-testid="async-select-options"
      >
        {option => (
          <ListBoxItem
            id={option.value}
            textValue={option.label}
            className={listBoxItemStyles}
            data-testid="async-select-option"
          >
            <SelectItem label={option.label} description={option.description} />
          </ListBoxItem>
        )}
      </ListBox>

      {!!actions && (
        <SelectActions
          onClear={isClearable ? handleClear : undefined}
          onConfirm={isConfirmable ? handleConfirm : undefined}
        />
      )}
    </>
  );
}

const AsyncSelectButton = styled('div', {
  base: {
    position: 'relative',
  },
});

const AsyncSelectDialog = styled(Dialog, {
  base: {
    outline: 'none',
  },
});

const asyncSelectListBoxStyles = css({
  outline: 'none',
  maxHeight: '400px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

const AsyncSelectEmpty = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100px',
    padding: '$small',
    textAlign: 'center',
  },
});
