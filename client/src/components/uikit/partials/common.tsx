import { ComponentProps } from 'react';
import { Text } from 'react-aria-components';

import Icon from '../Icon';
import { css } from '~styled-system/css';

export const inputWrapperStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '$xxs',
});

export const baseInputStyles = css({
  '--outline-width': '1px',
  textStyle: '$body',
  padding: '$small',
  width: '100%',
  color: '$text',
  borderRadius: '$regular',
  border: '1px solid token($colors.line3)',
  outlineOffset: 'calc(0px - var(--outline-width))',

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
  },
});

/**
 * Add a `data-required` attribute to render an `*` after the label
 */
export const labelStyles = css({
  textStyle: '$body',
  color: '$text',
  marginBottom: '$xxs',

  '&[data-required="true"]': {
    '&:after': {
      content: '" *"',
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

export const DescriptionText = (
  props: Omit<ComponentProps<typeof Text>, 'slot'>
) => (
  <Text
    {...props}
    slot="description"
    className={css({ textStyle: '$bodySmall' })}
  />
);

export const ErrorText = ({
  children,
  ...rest
}: Omit<ComponentProps<typeof Text>, 'slot'>) => (
  <Text
    {...rest}
    slot="errorMessage"
    className={css({
      textStyle: '$bodySmall',
      color: '$errorText',
      display: 'flex',
      alignItems: 'center',
      '& > svg': {
        marginRight: '$xxs',
      },
    })}
  >
    <Icon name="warning" size={14} color="error" />
    {children}
  </Text>
);

export const listBoxStyles = css({
  width: 'var(--trigger-width)' /* magical var from react-aria */,
  padding: '$xs',
  borderWidth: '1px',
  borderColor: '$line3',
  borderRadius: '$regular',
  backgroundColor: '$surface',
  boxShadow: '$regular',
  outline: 'none',

  /* The 'Item' component isn't the actual thing that gets rendered, so we need
   * to style it indirectly */
  '& .react-aria-Item': {
    position: 'relative',
    paddingBlock: '$xs',
    paddingRight: '$small',
    paddingLeft: '$medium',
    borderRadius: '$small',

    '&[aria-selected="true"]': {
      textStyle: '$bodyBold',

      '&:before': {
        content: "'✓'",
        position: 'absolute',
        left: '6px',
      },
    },

    '&[data-focused="true"]': {
      color: '$primaryText',
      backgroundColor: '$primaryMuted',
      outline: 'none',
    },
  },
});
