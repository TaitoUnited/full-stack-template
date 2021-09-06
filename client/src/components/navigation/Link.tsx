import { forwardRef, useMemo, ReactNode } from 'react';
import { FocusRing } from 'react-aria';
import styled, { css } from 'styled-components';

import {
  NavLink as RRNavLink,
  Link as RRLink,
  LinkProps,
  matchPath,
} from 'react-router-dom';

import { useStaleReload } from '../../utils/routing';
import { routes } from '../../routes';

type Props = LinkProps & {
  children: ReactNode;
  preloadMethod?: 'hover' | 'click';
};

export const Link = forwardRef<any, Props>(
  ({ children, to, preloadMethod, ...props }, ref: any) => {
    const p = useLinkProps(to, preloadMethod);

    return (
      <FocusRing focusRingClass="link-focus">
        <LinkWrapper {...props} {...p} to={to} ref={ref}>
          {children}
        </LinkWrapper>
      </FocusRing>
    );
  }
);

Link.displayName = 'Link';

export const UnstyledLink = forwardRef<any, Props>(
  ({ children, to, preloadMethod, ...props }, ref: any) => {
    const p = useLinkProps(to, preloadMethod);

    return (
      <UnstyledLinkWrapper {...props} {...p} to={to} ref={ref}>
        {children}
      </UnstyledLinkWrapper>
    );
  }
);

UnstyledLink.displayName = 'UnstyledLink';

// Nav link knows whether it is active or not based on the current url
export const NavLink = forwardRef<any, Props>(
  ({ children, to, preloadMethod, ...props }, ref: any) => {
    const p = useLinkProps(to, preloadMethod);

    return (
      <FocusRing focusRingClass="link-focus">
        <NavLinkWrapper {...props} {...p} to={to} ref={ref}>
          {children}
        </NavLinkWrapper>
      </FocusRing>
    );
  }
);

NavLink.displayName = 'NavLink';

function useLinkProps(
  to: Props['to'],
  preloadMethod: Props['preloadMethod'] = 'hover'
) {
  const isStale = useStaleReload();

  function handleStaleNavigation() {
    // Auto-reload the app if enough time has passed from last navigation
    if (isStale) setTimeout(() => window.location.reload(), 100);
  }

  // Preload route code for faster page load experience
  async function handlePreload() {
    const match = ({ path }: any) => {
      // Remove search params
      const [_to] = to.toString().split('?');

      // Absolute links
      if (to.toString().startsWith('/')) {
        return matchPath(path, _to);
      }

      // Relative links
      return matchPath(path, `${location.pathname}/${_to}`);
    };

    const route = routes.find(match);

    if (route?.component && route.component.preload) {
      try {
        await route.component.preload(match(route)?.params);
      } catch (error) {
        console.log('> Failed to preload route', error);
      }
    }
  }

  return useMemo(
    () => ({
      onClick: handleStaleNavigation,
      onMouseEnter: preloadMethod === 'hover' ? handlePreload : undefined,
      onMouseDown: preloadMethod === 'click' ? handlePreload : undefined,
    }),
    [to, preloadMethod] // eslint-disable-line
  );
}

const linkStyles = css`
  text-decoration: none;
  outline: none;

  &.link-focus {
    text-decoration: underline;
    text-decoration-color: ${p => p.theme.colors.primary};
    text-decoration-skip-ink: auto;
    text-decoration-thickness: 2px;
  }
`;

const UnstyledLinkWrapper = styled(RRLink)`
  text-decoration: none;
  outline: none;
`;

const LinkWrapper = styled(RRLink)`
  ${linkStyles}
`;

const NavLinkWrapper = styled(RRNavLink)`
  ${linkStyles}
`;
