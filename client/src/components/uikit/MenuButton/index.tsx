import { useRef, useState } from 'react';

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
import { styled } from '~styled-system/jsx';
import { ColorToken } from '~styled-system/tokens';
import { StyledSystemToken } from '~utils/styled-system';

type Props = {
  label: string;
  actions: Array<{ action: string; label: string }>;
  iconColor?: StyledSystemToken<ColorToken>;
  children?: React.ReactNode;
  className?: string;
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
              name="ellipsisVertical"
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

const MenuButtonWrapper = styled('div', {
  base: {
    position: 'relative',
    display: 'inline-flex',
  },
});

const MenuButtonTrigger = styled('button', {
  base: {
    minWidth: '24px',
    minHeight: '24px',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '$full',

    '&:hover': {
      backgroundColor: '$hoverHighlight',
    },

    '&:active': {
      backgroundColor: '$pressHighlight',
    },

    '&.menu-button-trigger-focus': {
      $focusRing: '',
    },
  },
});

const MenuPopupList = styled('ul', {
  base: {
    overflow: 'hidden',
    outline: 'none',
    minWidth: '80px',
    backgroundColor: '$elevated',
    border: '1px solid',
    borderColor: '$border',
    borderRadius: '$small',
    boxShadow: '$large',
  },
});

const MenuItemWrapper = styled('li', {
  base: {
    textStyle: '$bodySmall',
    cursor: 'pointer',
    outline: 'none',
    color: '$text',
    paddingBlock: '$xsmall',
    paddingInline: '$normal',
  },
  variants: {
    isFocused: {
      true: {
        backgroundColor: '$hoverHighlight',
      },
      false: {
        backgroundColor: 'transparent',
      },
    },
  },
});
