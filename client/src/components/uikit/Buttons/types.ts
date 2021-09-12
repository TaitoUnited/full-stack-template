import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { IconType } from 'react-icons/lib';

export type ButtonSize = 'small' | 'normal' | 'large';

export type ButtonVariant = 'primary' | 'warn' | 'error' | 'info';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: keyof JSX.IntrinsicElements;
  children: ReactNode;
  disabled?: boolean;
  icon?: IconType;
  iconPlacement?: 'left' | 'right';
  loading?: boolean;
  onClick?: () => any;
  size?: ButtonSize;
  variant: ButtonVariant;
  testId?: string;
};
