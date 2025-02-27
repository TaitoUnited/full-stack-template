import { useLingui } from '@lingui/react/macro';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import type { PressEvent } from 'react-aria-components';
import { Button as AriaButton } from 'react-aria-components';

import { css, cva, cx } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';
import { token } from '~/styled-system/tokens';

import { Icon, type IconName } from '../icon';
import { IconButton } from '../icon-button';

type ChipVariant = 'valid' | 'warning' | 'error' | 'descriptive';

type ChipProps = {
  className?: string;
  children: ReactNode;
  toggled?: boolean;
  onToggle?: (event: PressEvent) => void;
  removable?: boolean;
  onRemove?: (event: PressEvent) => void;
  variant?: ChipVariant;
  icon?: IconName;
} & Omit<ComponentProps<typeof AriaButton>, 'children'>;

const variantToColor: Record<ChipVariant, ChipColor> = {
  valid: 'success',
  warning: 'warn',
  error: 'error',
  descriptive: 'primary',
};

export function Chip({
  className,
  children,
  toggled,
  onToggle,
  removable,
  onRemove,
  variant = 'descriptive',
  icon,
  style,
  ...rest
}: ChipProps) {
  const { t } = useLingui();
  const _style = {
    ...style,
    ...getChipStyles({ color: variantToColor[variant], toggled: !!toggled }),
  };

  const content = <ChipContent>{children}</ChipContent>;

  // TODO: Togglable chip is a WIP that needs to be refined if needed somewhere
  if (typeof toggled !== 'undefined') {
    return (
      <AriaButton
        {...rest}
        style={_style}
        className={cx(chipStyles({ toggleable: true, toggled }), className)}
        onPress={onToggle}
      >
        {content}
      </AriaButton>
    );
  }

  return (
    <div style={_style} className={cx(chipStyles(), className)}>
      {!!icon && (
        <Icon
          size={16}
          name={icon}
          color={variantToColor[variant]}
          className={chipIconStyles}
          aria-hidden
        />
      )}
      {content}
      {removable && (
        <IconButton
          size={24}
          variant="plain"
          icon="close"
          label={t`Remove`}
          className={chipRemoveStyles}
          onPress={onRemove}
        />
      )}
    </div>
  );
}

type ChipColor = 'primary' | 'success' | 'error' | 'warn';

function getChipStyles({
  color,
  toggled,
}: {
  color: ChipColor;
  toggled: boolean;
}) {
  return {
    '--color-muted': token.var(`$colors.${color}Muted`),
    '--color-border': toggled
      ? token.var(`$colors.${color}Contrast`)
      : token.var(`$colors.${color}Muted`),
    '--color-hover': token.var(`$colors.${color}MutedHover`),
  } as CSSProperties;
}

const ChipContent = styled('span', {
  base: {
    paddingInline: '$xs',
    paddingBlock: '$xxs',
    textStyle: '$bodySmallSemiBold',
    lineHeight: '1',
    transform: 'translateY(1px)', // Aligns text with icon
    pointerEvents: 'none',
    userSelect: 'none',
  },
});

/**
 * NOTE: negative margin is used to reduce the gap between the icon and the text
 * for visually better spacing.
 */

const chipIconStyles = css({
  pointerEvents: 'none',
  marginLeft: '$xxs',
  marginRight: '-$xxs ',
});

const chipRemoveStyles = css({
  marginLeft: '-$xxs ',
});

const chipStyles = cva({
  base: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'max-content',
    borderRadius: '$full',
    border: '1px solid',
    backgroundColor: 'var(--color-muted)',
    borderColor: 'var(--color-border)',
  },
  variants: {
    toggleable: {
      true: {
        '&:hover': {
          backgroundColor: 'var(--color-hover)',
        },
      },
    },
    toggled: {
      false: {
        backgroundColor: '$neutral5',
        borderColor: '$line2',
      },
    },
  },
});
