import type { LinkComponent } from '@tanstack/react-router';
import { createLink } from '@tanstack/react-router';
import {
  type AnchorHTMLAttributes,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from 'react';
import {
  mergeProps,
  useFocusRing,
  useHover,
  useLink,
  useObjectRef,
} from 'react-aria';

import { css, cx } from '~/styled-system/css';
import { mapToAriaProps } from '~/utils/aria';

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  ref?: Ref<HTMLAnchorElement>;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

function LinkBase({ ref, ...props }: LinkProps) {
  const objectRef = useObjectRef(ref);

  /**
   * Tanstack Router passes regular DOM event handler props, eg. `onClick`,
   * to this component so we need to map them to React Aria supported props,
   * eg. `onPress` (otherwise React Aria will complain).
   */
  const ariaProps = mapToAriaProps(props);
  const { isPressed, linkProps } = useLink(ariaProps, objectRef);
  const { isHovered, hoverProps } = useHover(ariaProps);
  const { isFocusVisible, isFocused, focusProps } = useFocusRing(ariaProps);

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      {...mergeProps(linkProps, hoverProps, focusProps, props)}
      ref={objectRef}
      data-hovered={isHovered || undefined}
      data-pressed={isPressed || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-focused={isFocused || undefined}
      className={cx(linkStyles, props.className)}
      style={props.style}
    />
  );
}

const CreatedLinkComponent = createLink(LinkBase);

// eslint-disable-next-line func-style
export const Link: LinkComponent<typeof LinkBase> = props => {
  return <CreatedLinkComponent preload={'intent'} {...props} />;
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
