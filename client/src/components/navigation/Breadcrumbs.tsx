import React from 'react';
import ReactDOM from 'react-dom';
import { truncate } from 'lodash';
import { useBreadcrumbs, useBreadcrumbItem } from 'react-aria';

import { Link } from './Link';
import { Icon } from '~uikit';
import { styled } from '~styled-system/jsx';

type Props = {
  children: any;
};

export default function Breadcrumbs({ children }: Props) {
  const { navProps } = useBreadcrumbs({});
  const [breadcrumbsElement, setBreadcrumbsElement] = React.useState<HTMLElement | null>(null); // prettier-ignore
  const childrenArray = React.Children.toArray(children);

  const content = (
    <nav {...navProps}>
      <BreadcrumbList>
        {childrenArray.map((child: any, i) =>
          React.cloneElement(child, {
            isCurrent: i === childrenArray.length - 1,
          })
        )}
      </BreadcrumbList>
    </nav>
  );

  React.useLayoutEffect(() => {
    setBreadcrumbsElement(document.getElementById('breadcrumbs-slot'));
  }, []);

  if (!breadcrumbsElement) return null;

  return ReactDOM.createPortal(content, breadcrumbsElement as any);
}

Breadcrumbs.Link = BreadcrumbLink;

function BreadcrumbLink({
  to = '',
  isCurrent = false,
  children,
}: {
  to?: string;
  isCurrent?: boolean;
  children: string;
}) {
  const ref = React.useRef<any>();
  const { itemProps } = useBreadcrumbItem({ children, isCurrent }, ref);

  return (
    <BreadcrumbItem current={!!isCurrent}>
      <Link {...itemProps} ref={ref} to={to}>
        {truncate(children, { length: 15 })}
      </Link>

      {!isCurrent && (
        <Icon
          name="chevronRight"
          size={16}
          color="muted1"
          aria-hidden="true"
          className="breadcrumb-separator"
        />
      )}
    </BreadcrumbItem>
  );
}

const BreadcrumbList = styled('ol', {
  base: {
    display: 'flex',
    padding: '$normal',
  },
});

const BreadcrumbItem = styled('li', {
  base: {
    display: 'flex',
    alignItems: 'center',

    '& a': {
      textStyle: '$body',
      cursor: 'pointer',
      color: '$textMuted',
    },

    '& .breadcrumb-separator': {
      margin: '0px token(spacing.$xxsmall)',
    },
  },

  variants: {
    current: {
      true: {
        '& a': {
          cursor: 'default',
          color: '$text',
        },
      },
    },
  },
});
