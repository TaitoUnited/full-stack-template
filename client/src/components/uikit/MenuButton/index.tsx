import { useRef, useState } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import styled from 'styled-components';

import {
  Item,
  TreeState,
  useTreeState,
  useMenuTriggerState,
  MenuTriggerState,
} from 'react-stately';

import {
  DismissButton,
  FocusRing,
  FocusScope,
  mergeProps,
  useButton,
  useFocus,
  useFocusVisible,
  useMenu,
  useMenuItem,
  useMenuTrigger,
  useOverlay,
  useOverlayPosition,
  VisuallyHidden,
  OverlayContainer,
} from 'react-aria';

import Icon from '../Icon';
import { focusRing } from '~utils/styled';
import type { Color } from '~constants/theme';

type Props = {
  label: string;
  actions: Array<{ action: string; label: string }>;
  iconColor?: Color;
  children?: React.ReactNode;
  onAction: (action: string) => void;
};

// Based on https://react-spectrum.adobe.com/react-aria/useMenuTrigger.html
export default function MenuButton({
  label,
  actions,
  iconColor = 'text',
  onAction,
  children,
  ...rest
}: Props) {
  const state = useMenuTriggerState({});
  const triggerRef = useRef<any>();

  const { menuTriggerProps, menuProps } = useMenuTrigger(
    { type: 'menu' },
    state,
    triggerRef
  );

  const { buttonProps } = useButton(menuTriggerProps, triggerRef);

  // HACK: https://github.com/adobe/react-spectrum/issues/1301#issuecomment-737378129
  useFocusVisible();

  return (
    <MenuButtonWrapper
      className="menu-button"
      data-open={state.isOpen ? 'true' : 'false'}
    >
      <FocusRing focusRingClass="menu-button-trigger-focus">
        <MenuButtonTrigger {...rest} {...buttonProps} ref={triggerRef}>
          <VisuallyHidden>{label}</VisuallyHidden>
          {children || (
            <Icon
              icon={FiMoreVertical}
              size={16}
              color={iconColor}
              aria-hidden="true"
            />
          )}
        </MenuButtonTrigger>
      </FocusRing>

      {state.isOpen && (
        <OverlayContainer>
          <MenuPopup
            label={label}
            triggerRef={triggerRef}
            domProps={menuProps}
            onAction={onAction}
            menuState={state}
          >
            {actions.map(item => (
              <Item key={item.action}>{item.label}</Item>
            ))}
          </MenuPopup>
        </OverlayContainer>
      )}
    </MenuButtonWrapper>
  );
}

type MenuPopupProps = {
  label: string;
  triggerRef: any;
  domProps: any;
  children: any;
  menuState: MenuTriggerState;
  onAction: (action: string) => void;
};

function MenuPopup({
  label,
  triggerRef,
  domProps,
  menuState,
  onAction,
  children,
}: MenuPopupProps) {
  const state = useTreeState({ selectionMode: 'none', children });
  const ref = useRef<any>();
  const overlayRef = useRef<any>();
  const onClose = () => menuState.close();

  const { menuProps } = useMenu(
    { autoFocus: menuState.focusStrategy, 'aria-label': label },
    state,
    ref
  );

  const { overlayProps } = useOverlay(
    {
      onClose,
      shouldCloseOnBlur: true,
      isOpen: true,
      isDismissable: true,
    },
    overlayRef
  );

  const { overlayProps: positionProps } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef,
    placement: 'bottom',
    offset: 8,
    isOpen: menuState.isOpen,
  });

  return (
    <FocusScope restoreFocus>
      <div {...mergeProps(overlayProps, positionProps)} ref={overlayRef}>
        <DismissButton onDismiss={onClose} />

        <MenuPopupList {...mergeProps(menuProps, domProps)} ref={ref}>
          {[...state.collection].map(item => (
            <MenuItem
              key={item.key}
              item={item}
              state={state}
              onAction={onAction}
              onClose={onClose}
            />
          ))}
        </MenuPopupList>

        <DismissButton onDismiss={onClose} />
      </div>
    </FocusScope>
  );
}

type MenuItemProps = {
  item: any;
  state: TreeState<any>;
  onAction: (action: string) => void;
  onClose: () => void;
};

function MenuItem({ item, state, onAction, onClose }: MenuItemProps) {
  const ref = useRef<any>();
  const [isFocused, setFocused] = useState(false);
  const { focusProps } = useFocus({ onFocusChange: setFocused });
  const { menuItemProps } = useMenuItem(
    {
      key: item.key,
      isDisabled: item.isDisabled,
      onAction,
      onClose,
    },
    state,
    ref
  );

  return (
    <MenuItemWrapper
      {...mergeProps(menuItemProps, focusProps)}
      ref={ref}
      isFocused={isFocused}
    >
      {item.rendered}
    </MenuItemWrapper>
  );
}

const MenuButtonWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const MenuButtonTrigger = styled.button`
  background: none;
  border: none;
  appearance: none;
  outline: none;
  width: 24px;
  height: 24px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: ${p => p.theme.radii.full}px;

  &:hover {
    background-color: ${p => p.theme.colors.hoverHighlight};
  }

  &:active {
    background-color: ${p => p.theme.colors.activeHighlight};
  }

  &.menu-button-trigger-focus {
    ${focusRing}
  }
`;

const MenuPopupList = styled.ul`
  overflow: hidden;
  outline: none;
  min-width: 80px;
  background-color: ${p => p.theme.colors.elevated};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: ${p => p.theme.radii.small}px;
  ${p => p.theme.shadows.large}
`;

const MenuItemWrapper = styled.li<{ isFocused: boolean }>`
  cursor: pointer;
  outline: none;
  padding: ${p => p.theme.spacing.xsmall}px ${p => p.theme.spacing.normal}px;
  color: ${p => p.theme.colors.text};
  background-color: ${p =>
    p.isFocused ? p.theme.colors.hoverHighlight : 'transparent'};
  ${p => p.theme.typography.bodySmall}
`;
