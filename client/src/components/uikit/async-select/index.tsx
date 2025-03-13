import { Trans, useLingui } from '@lingui/react/macro';
import { type Ref, use, useState } from 'react';
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
import { useAsyncList } from 'react-stately';
import useMeasure from 'react-use-measure';

import { css, cx } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';
import { InputLayout } from '~/uikit/partials/input-layout';

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
import { SelectActions } from '../partials/select-actions';
import { SelectFilterInput } from '../partials/select-filter-input';
import { SelectItem } from '../partials/select-item';
import { getValidationParams } from '../partials/validation';
import { Spinner } from '../spinner';
import { Text } from '../text';

export type AsyncSelectOption = {
  value: string;
  label: string;
  description?: string;
};

export type AsyncSelectLoadOptions = (state: {
  filterText?: string;
  signal: AbortSignal;
}) => Promise<{ items: AsyncSelectOption[] }>;

type Props = Omit<FormComponentProps<ButtonProps>, 'onChange' | 'value'> & {
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
  icon?: IconName;
  selectionMode?: 'single' | 'multiple';
  value: Set<string>;
  onChange: (value: Set<string>) => void;
};

export function AsyncSelect({
  ref,
  label,
  hiddenLabel,
  labelledby,
  labelPosition: labelPositionProp,
  icon,
  isRequired,
  actions,
  emptyMessage,
  validationMessage,
  description,
  placeholder = '',
  selectionMode,
  value,
  onChange,
  loadItems,
  ...rest
}: Props) {
  const { t } = useLingui();
  const [measureRef, dimensions] = useMeasure();
  const inputContext = useInputContext();
  const labelPosition = labelPositionProp ?? inputContext.labelPosition;
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
          <AsyncSelectButton ref={measureRef}>
            {!!icon && (
              <Icon
                name={icon}
                size={18}
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
              data-testid="async-select-button"
              className={cx(
                inputBaseStyles(),
                css({
                  paddingRight: '$xl!',
                  color: '$textMuted',
                  $truncate: true,
                  '&[data-has-icon="true"]': { paddingLeft: '$2xl' },
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
          </AsyncSelectButton>
        </InputLayout>

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
            emptyMessage={emptyMessage ?? t`No options found`}
            selectionMode={selectionMode}
            value={value}
            onChange={onChange}
            loadItems={loadItems}
            hiddenLabel={hiddenLabel}
            labelledby={labelledby}
          />
        </Popover>
      </div>
    </DialogTrigger>
  );
}

function AsyncSelectOptions({
  emptyMessage,
  actions,
  selectionMode,
  value,
  hiddenLabel,
  labelledby,
  onChange,
  loadItems,
}: Pick<
  Props,
  | 'actions'
  | 'selectionMode'
  | 'value'
  | 'onChange'
  | 'loadItems'
  | 'emptyMessage'
  | 'hiddenLabel'
  | 'labelledby'
>) {
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
          <Text variant="body">
            <Trans>Something went wrong</Trans>
          </Text>
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
          actions={actions}
          selectionMode={selectionMode}
          value={value}
          onChange={onChange}
          hiddenLabel={hiddenLabel}
          labelledby={labelledby}
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
  value,
  hiddenLabel,
  labelledby,
  onChange,
}: Pick<
  Props,
  | 'actions'
  | 'selectionMode'
  | 'value'
  | 'onChange'
  | 'hiddenLabel'
  | 'labelledby'
> & {
  items: AsyncSelectOption[];
}) {
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
    onChange(new Set<string>());
    triggerState?.close();
  }

  function handleConfirm() {
    onChange(internalSelected);
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
        aria-labelledby={labelledby}
        aria-label={hiddenLabel}
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
