import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon';
import type { useLinkProps } from '~components/navigation/Link';

export type ButtonSize = 'small' | 'normal' | 'large';

export type ButtonVariant = 'primary' | 'warn' | 'error' | 'info';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asLink?: Parameters<typeof useLinkProps>[0];
  children: ReactNode;
  icon?: IconName;
  iconPlacement?: 'left' | 'right';
  loading?: boolean;
  size?: ButtonSize;
  variant: ButtonVariant;
  onClick?: () => any;
};
