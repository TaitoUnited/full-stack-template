import type { CSSProperties, ReactNode } from 'react';
import { createContext, use } from 'react';
import { Text as AriaText } from 'react-aria-components';

import { css, cva, cx } from '~/styled-system/css';

import { Icon } from '../icon';
import { Stack } from '../stack';

// Common input sub-components

export function DescriptionText({ children }: { children: ReactNode }) {
  return (
    <AriaText slot="description" className={descriptionTextStyles}>
      {children}
    </AriaText>
  );
}

const descriptionTextStyles = css({
  textStyle: '$bodySmall',
  color: '$textMuted',
  lineHeight: '1.5',
});

export function ErrorText({ children }: { children: ReactNode }) {
  return (
    <Stack direction="row" gap="xxs" align="center">
      <Icon name="error" size={16} color="error" style={{ flexShrink: 0 }} />
      <AriaText slot="errorMessage" className={errorTextStyles}>
        {children}
      </AriaText>
    </Stack>
  );
}

const errorTextStyles = css({
  textStyle: '$bodySmall',
  color: '$errorContrast',
  lineHeight: '1.5',
});

export function SelectedIcon() {
  return (
    <Icon
      className={cx('selected-icon', css({ display: 'none' }))}
      name="check"
      size={18}
      color="text"
    />
  );
}

export type LabelPosition = 'left' | 'top';

export const defaultLabelPosition: LabelPosition = 'top';

/**
 * Pass the label position to the input components via context
 * to easily change the layout of the form fields.
 */
export const InputContext = createContext<{
  labelPosition: LabelPosition;
}>({
  labelPosition: defaultLabelPosition,
});

export function useInputContext() {
  return use(InputContext);
}

// Common input styles

export const inputWrapperStyles = cva({
  variants: {
    labelPosition: {
      left: {
        display: 'grid',
        gridColumnGap: '$medium',
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'start',
      },
      top: {
        display: 'flex',
        flexDirection: 'column',
        gap: '$xs',
        alignItems: 'stretch',
      },
    },
  },
  defaultVariants: {
    labelPosition: defaultLabelPosition,
  },
});

export const inputBaseStyles = cva({
  base: {
    /**
     * Expose some variables so that they can be used inside the input base
     * component, eg. in `LanguageTextField` component.
     */
    '--outline-width': '1px',
    '--padding-vertical': '$spacing.xs',
    '--padding-horizontal': '$spacing.small',

    textStyle: '$body',
    textAlign: 'left',
    paddingTop: 'var(--padding-vertical)',
    paddingBottom: 'var(--padding-vertical)',
    paddingLeft: 'var(--padding-horizontal)',
    paddingRight: 'var(--padding-horizontal)',
    minHeight: '40px',
    width: '100%',
    color: '$text',
    borderRadius: '$regular',
    borderWidth: '1px',
    borderColor: '$line1',
    outlineOffset: 'calc(0px - var(--outline-width))',
    backgroundColor: '$surface',
    textOverflow: 'ellipsis',

    /**
     * Use `focus-within` so that components that use these styles for a wrapper
     * component gets the correct focus styles when the inner input is focused.
     */
    '&:focus-within': {
      '--outline-width': '2px',
      borderColor: 'transparent',
      outline: 'var(--outline-width) solid {$colors.focusRing}',
    },

    '&[disabled], &:has([disabled])': {
      backgroundColor: '$neutral5',
      cursor: 'not-allowed',
      borderColor: '$line2',
    },

    /**
     * Use `:has()` to allow using these styles on a wrapper component instead
     * of the input itself, eg. in `LanguageTextField` component.
     */
    '&[aria-invalid="true"],\
         &[data-invalid="true"],\
         &:has([aria-invalid="true"]),\
         &:has([data-invalid="true"])': {
      borderColor: 'transparent',
      outline: 'var(--outline-width) solid {$colors.error}',
    },
  },
});

export const labelContainerStyles = cva({
  base: {
    display: 'flex',
    gap: '$xs',
  },
  variants: {
    labelPosition: {
      left: {
        lineHeight: 1.4,
        paddingTop: '$xxs',
        width: 'var(--label-width, auto)',
        alignItems: 'center',
        justifyContent: 'flex-end',
        textAlign: 'right',
      },
      top: {
        lineHeight: 1,
      },
    },
  },
  defaultVariants: {
    labelPosition: defaultLabelPosition,
  },
});

/**
 * Add a `data-required` attribute to render an `*` after the label
 */
export const labelStyles = css({
  textStyle: '$label',
  textWrap: 'balance', // prettier multilines
  color: '$text',
  lineHeight: 'inherit',

  '&[data-required="true"]': {
    '&:after': {
      content: '" *"',
      color: '$error',
    },
  },
});

export const inputIconLeftStyles = css({
  position: 'absolute',
  left: '$regular',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
});

export const inputIconRightStyles = css({
  position: 'absolute',
  right: '$regular',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
});

export const listBoxStyles = css({
  width: 'var(--trigger-width)' /* magical var from react-aria */,
  maxHeight: '400px',
  overflowY: 'auto',
  borderWidth: '1px',
  borderRadius: '$regular',
  borderColor: '$line3',
  backgroundColor: '$surface',
  boxShadow: '$regular',
  outline: 'none',
});

/**
 * Height of a list box item without description and just one line.
 */
export const BEST_GUESS_LISTBOX_ITEM_HEIGHT = 37;

export const listBoxItemStyles = css({
  outline: 'none',
  position: 'relative',
  paddingBlock: '$xs',
  paddingInline: '$small',
  userSelect: 'none',
  cursor: 'default',

  // The selected item is hidden by default
  '&[data-selected="true"] .selected-icon': {
    display: 'block',
  },

  '&:hover, &[data-focused="true"]': {
    backgroundColor: '$primaryMuted',
  },

  '& span': {
    userSelect: 'none',
    cursor: 'default',
  },
});

// Common input types for consistent form component API

export type ValidationMessageOptions = {
  message: ReactNode;
  type: 'error' | 'warning';
};

/**
 * Common form component props for components that do not use React Aria
 */
export type CommonFormProps = {
  labelPosition?: LabelPosition;
  placeholder?: string;
  validationMessage?: string | ValidationMessageOptions;
  infoMessage?: string;
  description?: string;
  className?: string;
  style?: CSSProperties;
  value?: string;
  onChange?: (value: string) => void;
  /** Even though these exist in React Aria, we want to use same props in custom components */
  isRequired?: boolean;
  isDisabled?: boolean;
};

/**
 * Helper to omit unused aria props from a React Aria component
 */
type OmitAriaProps<T> = Omit<
  T,
  /* className and style are reduced to strings */
  | 'className'
  | 'style'
  /* value and onChange are used to handle all values (e.g. Select) instead of custom selectors */
  | 'selectedKey'
  | 'onSelectionChange'
  /* Validation is handled by the form */
  | 'validationBehavior'
  | 'validate'
  /* value and onChange are by default string, but can be overridden on component basis */
  | 'value'
  | 'onChange'
  /* label is handled separately */
  | 'label'
>;

/**
 * For accessibility reasons, you need to provide either `label`, `labelledby`,
 * or `hiddenLabel` as a prop.
 */
export type PropsWithLabelOptions<T> =
  | (T & {
      /** Text string to be displayed next to the input */
      label: ReactNode;
      labelledby?: undefined;
      hiddenLabel?: undefined;
    })
  | (T & {
      /** ID of an element that contains text naming this input */
      labelledby: string;
      label?: undefined;
      hiddenLabel?: undefined;
    })
  | (T & {
      /** Aria label for the input */
      hiddenLabel: string;
      labelledby?: undefined;
      label?: undefined;
    });

/**
 * Adds common form props to a React Aria component
 *
 * Can be extended at component level if uncommon props are needed (e.g. `items` for Select)
 *
 * @example
 * import type { TextFieldProps } from 'react-aria-components';
 *
 * type Props = FormComponentProps<TextFieldProps>;
 *
 * const TextField = (props: Props) => {
 *   return <AriaTextField {...props} />
 * })
 */
export type FormComponentProps<T> = PropsWithLabelOptions<
  CommonFormProps & OmitAriaProps<T>
>;
