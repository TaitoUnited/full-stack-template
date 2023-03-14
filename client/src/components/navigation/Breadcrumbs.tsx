import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { truncate } from 'lodash';
import { HiChevronRight } from 'react-icons/hi';
import { useBreadcrumbs, useBreadcrumbItem } from 'react-aria';

import { Link } from './Link';
import { Icon } from '~uikit';

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
          icon={HiChevronRight}
          size="small"
          color="muted1"
          aria-hidden="true"
          className="breadcrumb-separator"
        />
      )}
    </BreadcrumbItem>
  );
}

const BreadcrumbList = styled.ol`
  display: flex;
  padding: ${p => p.theme.spacing.normal}px;
`;

const BreadcrumbItem = styled.li<{ current: boolean }>`
  display: flex;
  align-items: center;

  a {
    cursor: ${p => (p.current ? 'default' : 'pointer')};
    color: ${p => p.theme.colors[p.current ? 'text' : 'muted1']};
    ${p => p.theme.typography.body}
  }

  .breadcrumb-separator {
    margin: 0px ${p => p.theme.spacing.xxsmall}px;
  }
`;
