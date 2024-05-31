import { forwardRef, useContext, useState } from 'react';
import { Trans, t } from '@lingui/macro';
import { useFilter } from 'react-aria';
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
import { styled } from '~styled-system/jsx';
import { css, cx } from '~styled-system/css';

export type MultiSelectOption = {
  value: string;
  label: string;
  description?: string;
};

type CommonProps = {
  items: MultiSelectOption[];
  /**
   * Whether to show the actions footer with buttons to confirm or clear the selection.
   */
  actions?: { confirm?: boolean; clear?: boolean };
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
      actions,
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
    const [measureRef, dimensions] = useMeasure();

    return (
      <DialogTrigger>
        <div className={inputWrapperStyles}>
          <Label
            className={labelStyles}
            data-required={isRequired}
            data-test-id="multi-select-label"
          >
            {label}
          </Label>

          <MultiSelectButton ref={measureRef}>
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
              data-test-id="multi-select-button"
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
          </MultiSelectButton>

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
              actions={actions}
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
  actions,
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
        <SelectFilterInput
          isLoading={false}
          inputValue={inputValue}
          onInputChange={setInputValue}
        />
      )}

      <MultiSelectOptionsList
        items={visibleItems}
        actions={actions}
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
  actions,
  items,
  selected,
  onSelect,
}: CommonProps) {
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
    triggerState.close();
  }

  function handleConfirm() {
    onSelect(internalSelected);
    triggerState.close();
  }

  return (
    <>
      <ListBox<MultiSelectOption>
        items={items}
        selectionMode="multiple"
        selectedKeys={selectedOptions}
        // We don't support the `'all'` selection value
        onSelectionChange={selection => handleSelect(selection as Set<string>)}
        data-test-id="multi-select-options"
        className={multiSelectListBoxStyles}
        renderEmptyState={() => (
          <MultiSelectEmpty>
            <Text variant="body">
              <Trans>No matching options.</Trans>
            </Text>
          </MultiSelectEmpty>
        )}
      >
        {option => (
          <ListBoxItem
            id={option.value}
            textValue={option.label}
            className={listBoxItemStyles}
            data-test-id="multi-select-option"
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

const MultiSelectButton = styled('div', {
  base: {
    position: 'relative',
  },
});

const MultiSelectDialog = styled(Dialog, {
  base: {
    outline: 'none',
  },
});

const multiSelectListBoxStyles = css({
  outline: 'none',
  maxHeight: '400px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
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
