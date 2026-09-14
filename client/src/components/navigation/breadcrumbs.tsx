import { useLingui } from '@lingui/react/macro';
import type { LinkProps, RegisteredRouter } from '@tanstack/react-router';
import {
  cloneElement,
  type ReactElement,
  type ReactNode,
  useSyncExternalStore,
} from 'react';
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
  Button,
} from 'react-aria-components';
import { createPortal } from 'react-dom';

import { css } from '~/design-system/css';
import { styled } from '~/design-system/jsx';
import { useBreakpoint } from '~/hooks/use-breakpoint';
import { Icon } from '~/uikit/icon';
import { Popover } from '~/uikit/popover';
import { Stack } from '~/uikit/stack';
import { Text } from '~/uikit/text';

import { Link } from './link';

let breadcrumbSlot: HTMLDivElement | null = null;
const breadcrumbSlotListeners = new Set<() => void>();

export function BreadcrumbSlot() {
  return <BreadcrumbSlotContainer ref={setBreadcrumbSlot} />;
}

type BreadcrumbsProps = {
  children:
    | ReactElement<BreadcrumbItemProps>
    | Array<ReactElement<BreadcrumbItemProps> | null>
    | null;
};

function BreadcrumbsRoot({ children }: BreadcrumbsProps) {
  const { t } = useLingui();
  const isNarrowScreen = useBreakpoint('mdDown');
  const portalTarget = useSyncExternalStore(
    subscribeToBreadcrumbSlot,
    getBreadcrumbSlot,
    getServerBreadcrumbSlot
  );

  const items = (Array.isArray(children) ? children : [children]).filter(
    (item): item is ReactElement<BreadcrumbItemProps> => item !== null
  );

  if (!portalTarget || items.length === 0) {
    return null;
  }

  return createPortal(
    isNarrowScreen ? (
      <BreadcrumbPopover items={items} />
    ) : (
      <HorizontalBreadcrumbs aria-label={t`Breadcrumbs`}>
        {items.map((item, index) => (
          <AriaBreadcrumb key={item.props.to} id={item.props.to}>
            {cloneElement(item, { hasPrecedingSeparator: index > 0 })}
          </AriaBreadcrumb>
        ))}
      </HorizontalBreadcrumbs>
    ),
    portalTarget
  );
}

type BreadcrumbItemProps = {
  children: ReactNode;
  to: LinkProps<RegisteredRouter>['to'];
  params?: LinkProps<RegisteredRouter>['params'];
  hasPrecedingSeparator?: boolean;
};

function BreadcrumbItem({
  to,
  children,
  params,
  hasPrecedingSeparator,
}: BreadcrumbItemProps) {
  return (
    <Stack direction="row" gap="xs" align="center">
      {hasPrecedingSeparator ? (
        <Icon name="chevronRight" size={14} color="textMuted" />
      ) : null}

      <Link to={to} params={params} className={breadcrumbLinkStyles}>
        <Text variant="bodySmall" as="span">
          {children}
        </Text>
      </Link>
    </Stack>
  );
}

function BreadcrumbPopover({
  items,
}: {
  items: ReactElement<BreadcrumbItemProps>[];
}) {
  const { t } = useLingui();
  const last = items.at(-1);

  if (!last) {
    return null;
  }

  return (
    <Popover
      placement="bottom"
      content={
        <VerticalBreadcrumbs aria-label={t`Breadcrumbs`}>
          {items.map((item, index) => (
            <AriaBreadcrumb key={item.props.to} id={item.props.to}>
              {cloneElement(item, { hasPrecedingSeparator: index > 0 })}
            </AriaBreadcrumb>
          ))}
        </VerticalBreadcrumbs>
      }
    >
      <BreadcrumbPopoverButton>
        <Stack direction="row" gap="xs" align="center">
          <Text variant="bodySmall" as="span" truncate>
            {last.props.children}
          </Text>

          <Icon name="chevronDown" size={16} color="textMuted" />
        </Stack>
      </BreadcrumbPopoverButton>
    </Popover>
  );
}

function setBreadcrumbSlot(slot: HTMLDivElement | null) {
  if (breadcrumbSlot === slot) {
    return;
  }

  breadcrumbSlot = slot;

  for (const listener of breadcrumbSlotListeners) {
    listener();
  }
}

function subscribeToBreadcrumbSlot(listener: () => void) {
  breadcrumbSlotListeners.add(listener);

  return () => {
    breadcrumbSlotListeners.delete(listener);
  };
}

function getBreadcrumbSlot() {
  return breadcrumbSlot;
}

function getServerBreadcrumbSlot() {
  return null;
}

const BreadcrumbSlotContainer = styled('div', {
  base: {
    minWidth: 0,
    flexGrow: 1,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    overflow: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },

    md: {
      paddingInline: '$regular',
    },
  },
});

const breadcrumbLinkStyles = css({
  color: '$textMuted',
  textDecoration: 'none',
});

const HorizontalBreadcrumbs = styled(AriaBreadcrumbs, {
  base: {
    display: 'flex',
    gap: '$xs',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
});

const VerticalBreadcrumbs = styled(AriaBreadcrumbs, {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '$regular',
  },
});

const BreadcrumbPopoverButton = styled(Button, {
  base: {
    minWidth: 0,
    maxWidth: '100%',
    padding: '$xs',
    borderRadius: '$regular',

    '&[data-pressed="true"]': {
      backgroundColor: '$neutral5',
    },
  },
});

export const Breadcrumbs = {
  Root: BreadcrumbsRoot,
  Item: BreadcrumbItem,
};
