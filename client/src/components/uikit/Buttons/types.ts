import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { IconType } from 'react-icons/lib';
import type { useLinkProps } from '~components/navigation/Link';

export type ButtonSize = 'small' | 'normal' | 'large';

export type ButtonVariant = 'primary' | 'warn' | 'error' | 'info';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asLink?: Parameters<typeof useLinkProps>[0];
  children: ReactNode;
  disabled?: boolean;
  icon?: IconType;
  iconPlacement?: 'left' | 'right';
  loading?: boolean;
  onClick?: () => any;
  size?: ButtonSize;
  variant: ButtonVariant;
};
