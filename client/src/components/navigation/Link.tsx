import { forwardRef, useMemo, ReactNode } from 'react';
import { FocusRing, mergeProps } from 'react-aria';
import styled, { css } from 'styled-components';

import {
  NavLink as RRNavLink,
  Link as RRLink,
  LinkProps,
  matchPath,
} from 'react-router-dom';

import { useStaleReload } from '../../utils/routing';
import { useRouteEntries } from '../../routes/route-utils';

type PreloadTrigger = 'hover' | 'click' | 'focus';

type Props = LinkProps & {
  children: ReactNode;
  testId?: string;
  preloadOn?: PreloadTrigger;
};

export const Link = forwardRef<any, Props>(
  ({ children, to, testId, preloadOn, ...props }, ref: any) => {
    const p = useLinkProps({ to, preloadOn });

    return (
      <FocusRing focusRingClass="link-focus">
        <LinkWrapper
          {...mergeProps(props, p)}
          to={to}
          ref={ref}
          data-test-id={testId}
        >
          {children}
        </LinkWrapper>
      </FocusRing>
    );
  }
);

Link.displayName = 'Link';

export const UnstyledLink = forwardRef<any, Props>(
  ({ children, to, testId, preloadOn, ...props }, ref: any) => {
    const p = useLinkProps({ to, preloadOn });

    return (
      <UnstyledLinkWrapper
        {...mergeProps(props, p)}
        to={to}
        ref={ref}
        data-test-id={testId}
      >
        {children}
      </UnstyledLinkWrapper>
    );
  }
);

UnstyledLink.displayName = 'UnstyledLink';

// Nav link knows whether it is active or not based on the current url
export const NavLink = forwardRef<any, Props>(
  ({ children, to, testId, preloadOn, ...props }, ref: any) => {
    const p = useLinkProps({ to, preloadOn });

    return (
      <FocusRing focusRingClass="link-focus">
        <NavLinkWrapper
          {...mergeProps(props, p)}
          to={to}
          ref={ref}
          data-test-id={testId}
        >
          {children}
        </NavLinkWrapper>
      </FocusRing>
    );
  }
);

NavLink.displayName = 'NavLink';

function useLinkProps({
  to,
  preloadOn = 'click',
}: {
  to: Props['to'];
  preloadOn?: PreloadTrigger;
}) {
  const isStale = useStaleReload();
  const routes = useRouteEntries();

  function handleStaleNavigation() {
    // Auto-reload the app if enough time has passed from last navigation
    if (isStale) setTimeout(() => window.location.reload(), 100);
  }

  // Preload route code for faster page load experience
  async function handlePreload() {
    const match = (path: string) => {
      // Remove search params
      const [_to] = to.toString().split('?');

      // Absolute links
      if (to.toString().startsWith('/')) {
        return matchPath(path, _to);
      }

      // Relative links
      return matchPath(path, `${location.pathname}/${_to}`);
    };

    const route = routes.find(r => match(r.path));

    if (route?.entry && route.entry.load) {
      try {
        await route.entry.load(match(route.path)?.params || {});
      } catch (error) {
        console.log('> Failed to preload route', error);
      }
    }
  }

  return useMemo(() => {
    const props: any = { onClick: handleStaleNavigation };

    if (preloadOn === 'click') {
      props.onMouseDown = handlePreload;
    } else if (preloadOn === 'hover') {
      props.onMouseEnter = handlePreload;
    } else if (preloadOn === 'focus') {
      props.onFocus = handlePreload;
    }

    return props;
  }, [to, preloadOn, isStale]); // eslint-disable-line react-hooks/exhaustive-deps
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
