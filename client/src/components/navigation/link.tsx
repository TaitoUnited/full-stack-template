import { createLink, type LinkComponent } from '@tanstack/react-router';
import { type CSSProperties, type Ref } from 'react';
import {
  // oxlint-disable-next-line no-restricted-imports
  Link as RACLink,
  type LinkProps as RACLinkProps,
} from 'react-aria-components';

import { css, cx } from '~/styled-system/css';
import { mapToAriaProps } from '~/utils/aria';

type LinkProps = Omit<RACLinkProps, 'className' | 'style'> & {
  ref?: Ref<HTMLAnchorElement>;
  className?: string;
  style?: CSSProperties;
};

function LinkBaseComponent({ ref, ...props }: LinkProps) {
  /**
   * Tanstack Router passes regular DOM event handler props, eg. `onMouseDown`,
   * to this component so we need to map them to React Aria supported props,
   * eg. `onPressStart` (otherwise React Aria will complain).
   */
  const ariaProps = mapToAriaProps(props);

  return (
    <RACLink
      ref={ref}
      className={cx(linkStyles, props.className)}
      {...props}
      {...ariaProps}
    />
  );
}

export const LinkBase = createLink(LinkBaseComponent);

// oxlint-disable-next-line func-style
export const Link: LinkComponent<typeof LinkBaseComponent> = props => {
  return <LinkBase preload="intent" {...props} />;
};

const linkStyles = css({
  textDecoration: 'none',
  outline: 'none',

  '&[data-focus-visible="true"]': {
    textDecoration: 'underline',
    textDecorationColor: '$primary',
    textDecorationSkipInk: 'auto',
    textDecorationThickness: '2px',
  },
});
