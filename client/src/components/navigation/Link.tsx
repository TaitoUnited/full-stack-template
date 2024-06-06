import { forwardRef, ReactNode } from 'react';
import { FocusRing } from 'react-aria';

/* eslint-disable no-restricted-imports */
import {
  NavLink as RRNavLink,
  Link as RRLink,
  LinkProps,
} from 'react-router-dom';

import { css, cx } from '~styled-system/css';

type Props = LinkProps & {
  children: ReactNode;
  preload?: boolean;
};

export const Link = forwardRef<HTMLAnchorElement, Props>(
  ({ children, to, className, preload = true, ...rest }, ref) => {
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
);

Link.displayName = 'Link';

export const UnstyledLink = forwardRef<HTMLAnchorElement, Props>(
  ({ children, to, className, preload = true, ...rest }, ref) => {
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
);

UnstyledLink.displayName = 'UnstyledLink';

// Nav link knows whether it is active or not based on the current url
export const NavLink = forwardRef<HTMLAnchorElement, Props>(
  ({ children, to, className, preload = true, ...rest }, ref) => {
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
);

NavLink.displayName = 'NavLink';

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
