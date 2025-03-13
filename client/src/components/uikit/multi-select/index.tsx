import { Trans, useLingui } from '@lingui/react/macro';
import { type Ref, use, useState } from 'react';
import { useFilter } from 'react-aria';
import {
  Button as AriaButton,
  type ButtonProps,
  Dialog,
  DialogTrigger,
  ListBox,
  ListBoxItem,
  OverlayTriggerStateContext,
  Popover,
} from 'react-aria-components';
import useMeasure from 'react-use-measure';

import { css, cx } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';

import { Icon, type IconName } from '../icon';
import {
  type FormComponentProps,
  inputBaseStyles,
  inputIconLeftStyles,
  inputIconRightStyles,
  inputWrapperStyles,
  listBoxItemStyles,
  listBoxStyles,
  useInputContext,
} from '../partials/common';
import { InputLayout } from '../partials/input-layout';
import { SelectActions } from '../partials/select-actions';
import { SelectFilterInput } from '../partials/select-filter-input';
import { SelectItem } from '../partials/select-item';
import { getValidationParams } from '../partials/validation';
import { Text } from '../text';

export type MultiSelectOption = {
  value: string;
  label: string;
  description?: string;
};

type Props = Omit<FormComponentProps<ButtonProps>, 'value' | 'onChange'> & {
  ref?: Ref<HTMLButtonElement>;
  items: MultiSelectOption[];
  /**
   * Whether to show the actions footer with buttons to confirm or clear the selection.
   */
  actions?: { confirm?: boolean; clear?: boolean };
  icon?: IconName;
  value: Set<string>;
  onChange: (value: Set<string>) => void;
};

/**
 * This `MultiSelect` component can be used to select multiple options from
 * a list of **static** options.
 *
 * For selecting a single option, use the regular `Select` component. If you
 * need to load options asynchronously, use the `AsyncSelect` component instead.
 * The `AsyncSelect` component supports both single and multiple selection modes.
 */
export function MultiSelect({
  ref,
  label,
  labelledby,
  hiddenLabel,
  labelPosition: labelPositionProp,
  icon,
  isRequired,
  actions,
  validationMessage,
  description,
  placeholder = '',
  items,
  value,
  onChange,
  ...rest
}: Props) {
  const { t } = useLingui();
  const inputContext = useInputContext();
  const labelPosition = labelPositionProp ?? inputContext.labelPosition;
  const [measureRef, dimensions] = useMeasure();
  const numSelected = value.size;
  const validation = getValidationParams(validationMessage);

  return (
    <DialogTrigger>
      <div className={inputWrapperStyles({ labelPosition })}>
        <InputLayout
          label={label}
          labelPosition={labelPosition}
          isRequired={isRequired}
          description={description}
          validation={validation}
        >
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
              data-invalid={validation.type === 'error'}
              data-has-icon={!!icon}
              data-has-selected={numSelected > 0}
              data-testid="multi-select-button"
              className={cx(
                inputBaseStyles(),
                css({
                  paddingRight: '$xl!',
                  color: '$textMuted',
                  $truncate: true,
                  '&[data-has-icon="true"]': { paddingLeft: '$xl' },
                  '&[data-has-selected="true"]': { color: '$text' },
                })
              )}
            >
              {numSelected === 0 ? placeholder : t`${numSelected} selected`}
            </AriaButton>

            <Icon
              name="arrowDropDown"
              size={24}
              color="text"
              className={cx(inputIconRightStyles, css({ right: '$xs!' }))}
            />
          </MultiSelectButton>
        </InputLayout>

        <Popover
          data-testid="multi-select-popover"
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
            value={value}
            onChange={onChange}
            hiddenLabel={hiddenLabel}
            labelledby={labelledby}
          />
        </Popover>
      </div>
    </DialogTrigger>
  );
}

function MultiSelectOptions({
  actions,
  items,
  value,
  hiddenLabel,
  labelledby,
  onChange,
}: Pick<
  Props,
  'items' | 'actions' | 'value' | 'onChange' | 'hiddenLabel' | 'labelledby'
>) {
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
        value={value}
        onChange={onChange}
        hiddenLabel={hiddenLabel}
        labelledby={labelledby}
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
  value,
  hiddenLabel,
  labelledby,
  onChange,
}: Pick<
  Props,
  'items' | 'actions' | 'value' | 'onChange' | 'hiddenLabel' | 'labelledby'
>) {
  const triggerState = use(OverlayTriggerStateContext);
  const [internalSelected, setInternalSelected] = useState(value);
  const isConfirmationRequired = Boolean(actions?.confirm);
  const selectedOptions = isConfirmationRequired ? internalSelected : value;

  // It only makes sense to show the clear button when there are selected options
  const isClearable = Boolean(actions?.clear && selectedOptions.size > 0);

  // Only show the confirm button when there are selected options
  const isConfirmable = Boolean(
    actions?.confirm && (internalSelected.size > 0 || value.size > 0)
  );

  function handleSelect(value: Props['value']) {
    if (isConfirmationRequired) {
      setInternalSelected(value);
    } else {
      onChange(value);
    }
  }

  function handleClear() {
    onChange(new Set());
    triggerState?.close();
  }

  function handleConfirm() {
    onChange(internalSelected);
    triggerState?.close();
  }

  return (
    <>
      <ListBox<MultiSelectOption>
        items={items}
        selectionMode="multiple"
        selectedKeys={selectedOptions}
        // We don't support the `'all'` selection value
        onSelectionChange={selection => handleSelect(selection as Set<string>)}
        data-testid="multi-select-options"
        aria-labelledby={labelledby}
        aria-label={hiddenLabel}
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
            data-testid="multi-select-option"
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
