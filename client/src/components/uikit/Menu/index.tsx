import {
  type CSSProperties,
  type ReactNode,
  type Ref,
  type RefAttributes,
} from 'react';
import {
  Header as AriaHeader,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  Section as AriaSection,
  type SectionProps as AriaSectionProps,
  Separator as AriaSeparator,
  type MenuItemProps,
  type MenuProps,
  MenuTrigger,
  type MenuTriggerProps,
  Popover,
  type PopoverProps,
} from 'react-aria-components';

import { cva } from '~styled-system/css';
import { styled } from '~styled-system/jsx';

import { SelectedIcon } from '../partials/common';
import { Stack } from '../Stack';
import './styles.css';

type Props = Omit<MenuTriggerProps, 'trigger'> & {
  ref?: Ref<HTMLDivElement>;
  children: ReactNode;
  trigger: ReactNode;
  className?: string;
  style?: CSSProperties;
  // Currently we don't want to expose any other PopoverProps
  offset?: PopoverProps['offset'];
  placement?: PopoverProps['placement'];
  // Currently we don't want to expose any other MenuProps
  selected?: Set<string>;
  selectionMode?: MenuProps<string>['selectionMode'];
};

function MenuBase({
  ref,
  trigger,
  children,
  className,
  style,
  offset = 8,
  placement = 'bottom start',
  selected,
  selectionMode,
  ...rest
}: Props) {
  return (
    <MenuTrigger data-testid="menu" {...rest}>
      {trigger}
      <Popover
        data-testid="menu-popover"
        offset={offset}
        placement={placement}
        className={({ isEntering, isExiting }) =>
          popoverStyles({ isEntering, isExiting })
        }
      >
        <MenuItems
          selectedKeys={selected}
          selectionMode={selectionMode}
          ref={ref}
          style={style}
          className={className}
          data-testid="menu-items"
        >
          {children}
        </MenuItems>
      </Popover>
    </MenuTrigger>
  );
}

function Item({
  ref,
  children,
  ...rest
}: Omit<MenuItemProps, 'id' | 'onAction' | 'children'> & {
  // Make some props required
  ref?: Ref<HTMLDivElement>;
  id: string;
  children: ReactNode;
  onAction: () => void;
}) {
  return (
    <MenuItem ref={ref} data-testid="menu-item" {...rest}>
      <Stack direction="row" gap="small" align="center" justify="space-between">
        {children}
        <SelectedIcon />
      </Stack>
    </MenuItem>
  );
}

type SectionProps = AriaSectionProps<any> &
  RefAttributes<HTMLElement> & {
    title: ReactNode;
    children: ReactNode;
  };

function Section({ ref, title, children, ...rest }: SectionProps) {
  return (
    <MenuSection data-testid="menu-section" ref={ref} {...rest}>
      <MenuSectionHeader data-testid="menu-section-title">
        {title}
      </MenuSectionHeader>
      {children}
    </MenuSection>
  );
}

const popoverStyles = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: '180px',
    padding: '$xs',
    borderRadius: '$small',
    borderWidth: '1px',
    borderColor: '$line3',
    boxShadow: '$regular',
    backgroundColor: '$surface',
  },

  variants: {
    isEntering: {
      true: {
        animation: 'menu-animation 150ms ease-out forwards',
      },
    },
    isExiting: {
      true: {
        animation: 'menu-animation 100ms ease-in reverse',
      },
    },
  },
});

const MenuItems = styled(AriaMenu, {
  base: {
    outline: 'none',
  },
});

const MenuItem = styled(AriaMenuItem, {
  base: {
    outline: 'none',
    display: 'block',
    padding: '$xs',
    textStyle: '$bodySmall',
    borderRadius: '$small',
    cursor: 'pointer',

    '&[data-hovered="true"], &[data-focused="true"], &[data-selected="true"]': {
      backgroundColor: '$primaryMuted',
    },
    '&[data-selected="true"] .selected-icon': {
      display: 'block',
    },
  },
});

const Separator = styled(AriaSeparator, {
  base: {
    height: '1px',
    backgroundColor: '$line3',
    marginBlock: '$xxs',
  },
});

const MenuSectionHeader = styled(AriaHeader, {
  base: {
    padding: '$xs',
    paddingBottom: '$xxs',
    color: '$textMuted',
    textStyle: '$overlineSmall',
  },
});

const MenuSection = styled(AriaSection, {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
});

// Add compound components to Menu
export const Menu = Object.assign(MenuBase, {
  Item,
  Separator,
  Section,
});
