import {
  CSSProperties,
  ReactNode,
  Ref,
  RefAttributes,
  forwardRef,
} from 'react';

import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuTrigger,
  MenuTriggerProps,
  MenuItemProps,
  MenuProps,
  Popover,
  PopoverProps,
  Header as AriaHeader,
  Separator as AriaSeparator,
  Section as AriaSection,
  SectionProps as AriaSectionProps,
} from 'react-aria-components';

import './styles.css';
import { SelectedIcon } from '../partials/common';
import { Stack } from '../Stack';
import { styled } from '~styled-system/jsx';
import { cva } from '~styled-system/css';

type Props = Omit<MenuTriggerProps, 'trigger'> & {
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

const MenuBase = forwardRef(
  (
    {
      trigger,
      children,
      className,
      style,
      offset = 8,
      placement = 'bottom start',
      selected,
      selectionMode,
      ...rest
    }: Props,
    ref: Ref<HTMLDivElement>
  ) => {
    return (
      <MenuTrigger data-test-id="menu" {...rest}>
        {trigger}
        <Popover
          data-test-id="menu-popover"
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
            data-test-id="menu-items"
          >
            {children}
          </MenuItems>
        </Popover>
      </MenuTrigger>
    );
  }
);

MenuBase.displayName = 'Menu';

const Item = forwardRef<
  HTMLDivElement,
  Omit<MenuItemProps, 'id' | 'onAction' | 'children'> & {
    // Make some props required
    id: string;
    children: ReactNode;
    onAction: () => void;
  }
>(({ children, ...rest }, ref) => {
  return (
    <MenuItem ref={ref} data-test-id="menu-item" {...rest}>
      <Stack direction="row" gap="small" align="center" justify="space-between">
        {children}
        <SelectedIcon />
      </Stack>
    </MenuItem>
  );
});

Item.displayName = 'MenuItem';

type SectionProps = AriaSectionProps<any> &
  RefAttributes<HTMLElement> & {
    title: ReactNode;
    children: ReactNode;
  };

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ title, children, ...rest }, ref) => {
    return (
      <MenuSection data-test-id="menu-section" ref={ref} {...rest}>
        <MenuSectionHeader data-test-id="menu-section-title">
          {title}
        </MenuSectionHeader>
        {children}
      </MenuSection>
    );
  }
);

Section.displayName = 'MenuSection';

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
