import { type ComponentProps } from 'react';

import { css, cx } from '~/styled-system/css';

import { Icon } from '../icon';
import { Stack } from '../stack';
import { Text } from '../text';

// Common input sub-components

export function DescriptionText(
  props: Omit<ComponentProps<typeof Text>, 'slot' | 'variant'>
) {
  return (
    <Text {...props} slot="description" variant="bodySmall" color="textMuted" />
  );
}

export function ErrorText({
  children,
  ...rest
}: Omit<ComponentProps<typeof Text>, 'slot' | 'variant'>) {
  return (
    <Stack direction="row" gap="xxs" align="center">
      <Icon name="error" size={18} color="error" />
      <Text
        {...rest}
        slot="errorMessage"
        variant="bodySmall"
        color="errorContrast"
      >
        {children}
      </Text>
    </Stack>
  );
}

export function SelectedIcon() {
  return (
    <Icon
      className={cx('selected-icon', css({ display: 'none' }))}
      name="check"
      size={20}
      color="text"
    />
  );
}

// Common input styles

export const inputWrapperStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '$xxs',
});

export const inputBaseStyles = css({
  '--outline-width': '1px',
  textStyle: '$body',
  textAlign: 'left',
  padding: '$small',
  minHeight: '50px',
  width: '100%',
  color: '$text',
  borderRadius: '$regular',
  borderWidth: '1px',
  borderColor: '$line1',
  outlineOffset: 'calc(0px - var(--outline-width))',
  backgroundColor: '$surface',

  '&:focus': {
    '--outline-width': '2px',
    borderColor: 'transparent',
    outline: 'var(--outline-width) solid token($colors.focusRing)',
  },
  '&[aria-invalid="true"], &[data-invalid="true"]': {
    borderColor: 'transparent',
    outline: 'var(--outline-width) solid token($colors.error)',
  },
  '&[disabled]': {
    backgroundColor: '$neutral5',
    cursor: 'not-allowed',
    borderColor: '$line2',
  },
});

/**
 * Add a `data-required` attribute to render an `*` after the label
 */
export const labelStyles = css({
  textStyle: '$label',
  color: '$text',

  '&[data-required="true"]': {
    '&:after': {
      content: '" *"',
      color: '$errorContrast',
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
  padding: '$xs',
  borderWidth: '1px',
  borderColor: '$line3',
  borderRadius: '$regular',
  backgroundColor: '$surface',
  boxShadow: '$regular',
  outline: 'none',
});

export const listBoxItemStyles = css({
  outline: 'none',
  position: 'relative',
  paddingBlock: '$xs',
  paddingInline: '$small',
  borderRadius: '$small',
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
