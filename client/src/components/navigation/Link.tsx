import { ReactNode, type Ref } from 'react';
import { FocusRing } from 'react-aria';

/* eslint-disable no-restricted-imports */
import {
  NavLink as RRNavLink,
  Link as RRLink,
  LinkProps,
} from 'react-router-dom';

import { css, cx } from '~styled-system/css';

type Props = LinkProps & {
  ref?: Ref<HTMLAnchorElement>;
  children: ReactNode;
  preload?: boolean;
};

export function Link({
  ref,
  children,
  to,
  className,
  preload = true,
  ...rest
}: Props) {
  return (
    <FocusRing focusRingClass="link-focus">
      <RRLink
        {...rest}
        data-preload={preload}
        className={cx(linkStyles, className)}
        to={to}
        ref={ref}
      >
        {children}
      </RRLink>
    </FocusRing>
  );
}

export function UnstyledLink({
  ref,
  children,
  to,
  className,
  preload = true,
  ...rest
}: Props) {
  return (
    <RRLink
      {...rest}
      data-preload={preload}
      className={cx(unstyledLinkStyles, className)}
      to={to}
      ref={ref}
    >
      {children}
    </RRLink>
  );
}

// Nav link knows whether it is active or not based on the current url
export function NavLink({
  ref,
  children,
  to,
  className,
  preload = true,
  ...rest
}: Props) {
  return (
    <FocusRing focusRingClass="link-focus">
      <RRNavLink
        {...rest}
        data-preload={preload}
        className={cx(linkStyles, className)}
        to={to}
        ref={ref}
      >
        {children}
      </RRNavLink>
    </FocusRing>
  );
}

const linkStyles = css({
  textDecoration: 'none',
  outline: 'none',

  '&.link-focus': {
    textDecoration: 'underline',
    textDecorationColor: '$primary',
    textDecorationSkipInk: 'auto',
    textDecorationThickness: '2px',
  },
});

const unstyledLinkStyles = css({
  textDecoration: 'none',
  outline: 'none',
});
