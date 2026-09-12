import { createLink, type LinkComponent } from '@tanstack/react-router';
import { type CSSProperties, type Ref } from 'react';
import {
  // oxlint-disable-next-line no-restricted-imports
  Link as RACLink,
  type LinkProps as RACLinkProps,
} from 'react-aria-components';

import { css, cx } from '~/design-system/css';

type LinkProps = Omit<RACLinkProps, 'className' | 'style'> & {
  ref?: Ref<HTMLAnchorElement>;
  className?: string;
  style?: CSSProperties;
};

function LinkBaseComponent({ ref, ...props }: LinkProps) {
  return (
    <RACLink ref={ref} className={cx(linkStyles, props.className)} {...props} />
  );
}

export const LinkBase = createLink(LinkBaseComponent);

// oxlint-disable-next-line no-restricted-imports
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
