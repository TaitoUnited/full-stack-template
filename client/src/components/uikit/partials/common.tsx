import { ComponentProps } from 'react';
import { Text } from 'react-aria-components';

import Icon from '../Icon';
import { css } from '~styled-system/css';

export const inputWrapperStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '$xxsmall',
});

export const baseInputStyles = css({
  '--outline-width': '1px',
  textStyle: '$body',
  padding: '$small',
  width: '100%',
  color: '$text',
  borderRadius: '$normal',
  border: '1px solid token(colors.$border)',
  outlineOffset: 'calc(0px - var(--outline-width))',

  '&:focus': {
    '--outline-width': '2px',
    borderColor: 'transparent',
    outline: 'var(--outline-width) solid token(colors.$primary)',
  },
  '&[aria-invalid="true"], &[data-invalid="true"]': {
    borderColor: 'transparent',
    outline: 'var(--outline-width) solid token(colors.$error)',
  },
  '&[disabled]': {
    backgroundColor: '$muted6',
    cursor: 'not-allowed',
  },
});

/**
 * Add a `data-required` attribute to render an `*` after the label
 */
export const labelStyles = css({
  textStyle: '$body',
  color: '$text',
  marginBottom: '$xxsmall',

  '&[data-required="true"]': {
    '&:after': {
      content: '" *"',
    },
  },
});

export const inputIconLeftStyles = css({
  position: 'absolute',
  left: '$normal',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
});

export const inputIconRightStyles = css({
  position: 'absolute',
  right: '$normal',
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
        marginRight: '$xxsmall',
      },
    })}
  >
    <Icon name="warningTriangle" size={14} color="error" />
    {children}
  </Text>
);

export const listBoxStyles = css({
  width: 'var(--trigger-width)' /* magical var from react-aria */,
  padding: '$xsmall',
  border: '1px solid',
  borderColor: '$border',
  borderRadius: '$normal',
  backgroundColor: '$elevated',
  boxShadow: '$normal',
  outline: 'none',

  /* The 'Item' component isn't the actual thing that gets rendered, so we need
   * to style it indirectly */
  '& .react-aria-Item': {
    position: 'relative',
    paddingBlock: '$xsmall',
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
