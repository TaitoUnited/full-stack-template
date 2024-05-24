import { forwardRef, useContext, useState } from 'react';
import { useAsyncList } from 'react-stately';
import { useMeasure } from 'react-use';
import { Trans, t } from '@lingui/macro';
import { VisuallyHidden } from 'react-aria';

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
import { Spinner } from '../Spinner';
import { Stack, styled } from '~styled-system/jsx';
import { css, cx } from '~styled-system/css';

export type MultiSelectOption = {
  value: string;
  label: string;
};

export type MultiSelectLoadOptions = (state: {
  filterText?: string;
  signal: AbortSignal;
}) => Promise<{ items: MultiSelectOption[] }>;

type CommonProps = {
  /**
   * Function to load options asynchronously. This function should return a
   * promise that resolves to `{ items: MultiSelectOption[] }`.
   * The function receives an object with an abort signal and a `search` property
   * that contains he current input value. This function will be initially called
   * with an empty string to load the initial set of options.
   */
  loadOptions: MultiSelectLoadOptions;
  /**
   * Whether to show the confirmation footer and require the user take an action
   * to apply the selection. If not provided, the selection is applied immediately
   * when the user selects an option.
   */
  isConfirmationRequired?: boolean;
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
  selected: Set<string>;
  onSelect: (value: Set<string>) => void;
};

type Props = ButtonProps &
  CommonProps & {
    label?: string;
    isRequired?: boolean;
    placeholder?: string;
  };

export const MultiSelect = forwardRef<HTMLButtonElement, Props>(
  (
    {
      label,
      icon,
      isConfirmationRequired,
      emptyMessage,
      errorMessage,
      description,
      placeholder = '',
      selected,
      onSelect,
      loadOptions,
      ...rest
    },
    ref
  ) => {
    const [measureRef, dimensions] = useMeasure<HTMLDivElement>();

    return (
      <DialogTrigger>
        <div className={inputWrapperStyles}>
          <Label className={labelStyles} data-required={rest.isRequired}>
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
              ref={ref}
              data-invalid={!!errorMessage}
              data-has-icon={!!icon}
              data-has-selected={selected.size > 0}
              className={cx(
                inputBaseStyles,
                css({
                  paddingRight: '$xl!',
                  color: '$textMuted',
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
              className={cx(inputIconRightStyles, css({ right: '$xs' }))}
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
              isConfirmationRequired={isConfirmationRequired}
              emptyMessage={emptyMessage}
              errorMessage={errorMessage}
              selected={selected}
              onSelect={onSelect}
              loadOptions={loadOptions}
            />
          </Popover>
        </div>
      </DialogTrigger>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';

function MultiSelectOptions({
  errorMessage = t`Something went wrong`,
  emptyMessage,
  isConfirmationRequired,
  selected,
  onSelect,
  loadOptions,
}: CommonProps) {
  const list = useAsyncList<MultiSelectOption>({ load: loadOptions });

  return (
    <MultiSelectDialog className={listBoxStyles}>
      <MultiSelectFilter>
        <VisuallyHidden>
          <Trans>Search options</Trans>
        </VisuallyHidden>

        <Icon name="search" size={20} color="textMuted" />

        <MultiSelectFilterInput
          autoFocus
          value={list.filterText}
          onChange={e => list.setFilterText(e.target.value)}
        />

        {list.loadingState === 'filtering' ? (
          <MultiSelectFilterSpinner>
            <Spinner size="small" color="text" />
          </MultiSelectFilterSpinner>
        ) : list.filterText ? (
          <IconButton
            icon="close"
            size={24}
            label={t`Clear search filter`}
            onClick={() => list.setFilterText('')}
          />
        ) : null}
      </MultiSelectFilter>

      {list.items ? (
        <MultiSelectOptionsList
          items={list.items}
          emptyMessage={emptyMessage}
          isConfirmationRequired={isConfirmationRequired}
          selected={selected}
          onSelect={onSelect}
        />
      ) : list.loadingState === 'error' ? (
        <MultiSelectEmpty>
          <Text variant="body">{errorMessage}</Text>
        </MultiSelectEmpty>
      ) : list.loadingState === 'loading' ? (
        <MultiSelectEmpty>
          <Spinner size="medium" color="text" />
        </MultiSelectEmpty>
      ) : null}
    </MultiSelectDialog>
  );
}

/**
 * NOTE: Keep internal state inside this component so that it is automatically
 * reset when the popover is closed! That way we don't need to do any manual
 * state synchronization and cleanup.
 */
function MultiSelectOptionsList({
  emptyMessage = t`No options found`,
  isConfirmationRequired = false,
  items,
  selected,
  onSelect,
}: Omit<CommonProps, 'loadOptions'> & {
  items: MultiSelectOption[];
}) {
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
            <Text variant="body">{emptyMessage}</Text>
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

const MultiSelectFilterSpinner = styled('div', {
  base: {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
