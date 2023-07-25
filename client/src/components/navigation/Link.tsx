/* eslint-disable no-restricted-imports */
import { forwardRef, useMemo, ReactNode } from 'react';
import { FocusRing, mergeProps } from 'react-aria';

import {
  NavLink as RRNavLink,
  Link as RRLink,
  LinkProps,
  matchPath,
} from 'react-router-dom';

import {
  LoaderParams,
  RouteEntries,
  parseEntrySearchParams,
  useRouteEntries,
} from '../../routes/route-utils';

import { useStaleReload } from '../../utils/routing';
import { css, cx } from '~styled-system/css';

type PreloadTrigger = 'hover' | 'click' | 'focus';

type Props = LinkProps & {
  children: ReactNode;
  preloadOn?: PreloadTrigger;
};

export const Link = forwardRef<any, Props>(
  ({ children, to, preloadOn, className, ...props }, ref: any) => {
    const p = useLinkProps({ to, preloadOn });

    return (
      <FocusRing focusRingClass="link-focus">
        <RRLink
          {...mergeProps(props, p)}
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

export const UnstyledLink = forwardRef<any, Props>(
  ({ children, to, preloadOn, className, ...props }, ref: any) => {
    const p = useLinkProps({ to, preloadOn });

    return (
      <RRLink
        {...mergeProps(props, p)}
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
export const NavLink = forwardRef<any, Props>(
  ({ children, to, preloadOn, className, ...props }, ref: any) => {
    const p = useLinkProps({ to, preloadOn });

    return (
      <FocusRing focusRingClass="link-focus">
        <RRNavLink
          {...mergeProps(props, p)}
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

export function useLinkProps({
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
    const [toPath, toSearchParams] = to.toString().split('?');

    const match = (path: string) => {
      // Remove search params

      // Absolute links
      if (to.toString().startsWith('/')) {
        return matchPath(path, toPath);
      }

      // Relative links
      return matchPath(path, `${location.pathname}/${toPath}`);
    };

    const route = flattenRoutes(routes).find(r => match(r.path));

    if (route?.entry && route.entry.load) {
      try {
        const params = match(route.path)?.params || {};

        const loaderParams = {
          ...params,
          searchParams: parseEntrySearchParams({
            searchParams: new URLSearchParams(toSearchParams),
            searchParamsOptions: route.entry.searchParamsOptions,
          }),
        } as LoaderParams<string>;

        await route.entry.load(loaderParams);
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

// Flatten the route tree into a list of routes so that we can match the current
// url to a route and preload it
function flattenRoutes(routes: RouteEntries) {
  const flattened: RouteEntries = [];

  routes.forEach(r => {
    flattened.push(r);

    const nested = flattenRoutes(r.children || []).map(n => ({
      ...n,
      path: `${r.path}/${n.path}`,
    }));

    flattened.push(...nested);
  });

  return flattened;
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
