import {
  type CSSProperties,
  type ReactNode,
  useLayoutEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { styled } from '~/styled-system/jsx';

type SlotProps = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};

export function Topbar(props: SlotProps) {
  return (
    <PageLayoutSlot slot="topbar">
      <TopbarContent {...props} />
    </PageLayoutSlot>
  );
}

export function LeftAside(props: SlotProps) {
  return (
    <PageLayoutSlot slot="left-aside">
      <LeftAsideContent {...props} />
    </PageLayoutSlot>
  );
}

export function RightAside(props: SlotProps) {
  return (
    <PageLayoutSlot slot="right-aside">
      <RightAsideContent {...props} />
    </PageLayoutSlot>
  );
}

export function Footer(props: SlotProps) {
  return (
    <PageLayoutSlot slot="footer">
      <FooterContent {...props} />
    </PageLayoutSlot>
  );
}

function PageLayoutSlot({
  slot,
  children,
}: {
  slot: 'topbar' | 'left-aside' | 'right-aside' | 'footer';
  children: ReactNode;
}) {
  const [element, setElement] = useState<Element | null>(null);

  useLayoutEffect(() => {
    const slotElement = document.querySelector(
      `[data-page-layout-slot="${slot}"]`
    );

    if (!slotElement) {
      throw new Error(`PageLayoutSlot: slot "${slot}" not found`);
    }

    setElement(slotElement);
  }, [slot]);

  if (!element) {
    return null;
  }

  return createPortal(children, element);
}

const TopbarContent = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    minHeight: '60px',
    paddingInline: '$regular',
    paddingBlock: '$xs',
    backgroundColor: '$surface',
    borderBottom: '1px solid token($colors.line3)',
  },
});

const LeftAsideContent = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxWidth: '300px',
    overflowY: 'auto',
    backgroundColor: '$surface',
    borderRight: '1px solid token($colors.line3)',
  },
});

const RightAsideContent = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxWidth: '300px',
    overflowY: 'auto',
    backgroundColor: 'transparent',
    borderLeft: '1px solid token($colors.line3)',
  },
});

const FooterContent = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    minHeight: '60px',
    paddingInline: '$regular',
    paddingBlock: '$xs',
    backgroundColor: '$surface',
    borderTop: '1px solid token($colors.line3)',
  },
});
