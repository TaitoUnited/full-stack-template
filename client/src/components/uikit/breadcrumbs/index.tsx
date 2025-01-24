import { type LinkProps } from '@tanstack/react-router';
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
  type Ref,
} from 'react';
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
  type BreadcrumbProps,
  type BreadcrumbsProps,
} from 'react-aria-components';

import { Link } from '~/components/navigation/link';
import { styled } from '~/styled-system/jsx';

import { Icon } from '../icon';

type Props = BreadcrumbsProps<any> & {
  ref?: Ref<HTMLOListElement>;
  children?: ReactNode;
};

function BreadcrumbList({ ref, children, onAction, ...rest }: Props) {
  return (
    <BreadcrumbContainer
      data-testid="breadcrumbs-list"
      ref={ref}
      onAction={onAction}
      {...rest}
    >
      {Children.map(children, (child, index) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            // We use this prop to determine if we should render a separator
            isLast: index === Children.count(children) - 1,
          } as any); // TODO: fix type?
        }
        return null;
      })}
    </BreadcrumbContainer>
  );
}

type BreadcrumbItemProps = BreadcrumbProps & {
  ref?: Ref<HTMLLIElement>;
  to?: LinkProps['to'];
  target?: string;
  children?: ReactNode;
};

function BreadcrumbItem({
  ref,
  children,
  to,
  target,
  // @ts-expect-error This prop is only used internally and passed down from
  // the Breadcrumbs component to determine if we should render a separator
  isLast = false,
  ...rest
}: BreadcrumbItemProps) {
  return (
    <Breadcrumb data-testid="breadcrumbs-item" ref={ref} {...rest}>
      <BreadcrumbLink data-testid="breadcrumbs-link" to={to} target={target}>
        {children}
      </BreadcrumbLink>
      {!isLast && (
        <Icon name="chevronRight" size={16} color="neutral1" aria-hidden />
      )}
    </Breadcrumb>
  );
}

const BreadcrumbContainer = styled(AriaBreadcrumbs, {
  base: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '$xs',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
});

const Breadcrumb = styled(AriaBreadcrumb, {
  base: {
    textStyle: '$bodySmallSemiBold',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '$xs',
  },
});

const BreadcrumbLink = styled(Link, {
  base: {
    textStyle: '$bodySmallSemiBold',
    lineHeight: 1,
    color: '$textMuted',
    outline: 'none',
    textDecoration: 'none',
    cursor: 'default',

    // Only links with href attribute should look clickable
    '&[href]': {
      cursor: 'pointer',
    },

    // Apply hover styles if has href attribute and is not last child
    '&:hover[href]:not(:last-child)': {
      textDecoration: 'underline',
      color: '$text',
    },

    '&[data-focus-visible="true"]': {
      borderRadius: '$regular',
      $focusRing: true,
    },
  },
});

// Add compound components to Breadcrumbs
export const Breadcrumbs = Object.assign(BreadcrumbList, {
  Item: BreadcrumbItem,
});
