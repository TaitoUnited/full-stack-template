import { useLingui } from '@lingui/react/macro';
import type { ReactNode } from 'react';
import type { PressEvent } from 'react-aria-components';

import { cva, cx } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';

import { IconButton } from '../icon-button';

export type ChipProps = {
  className?: string;
  children: ReactNode;
  toggled?: boolean;
  onToggle?: (event: PressEvent) => void;
  removable?: boolean;
  onRemove?: (event: PressEvent) => void;
  variant?: 'valid' | 'warning' | 'error' | 'descriptive';
};

export function Chip({
  className,
  children,
  removable,
  onRemove,
  variant = 'descriptive',
}: ChipProps) {
  const { t } = useLingui();

  return (
    <div className={cx(chipStyle({ variant }), className)}>
      <ChipContent>{children}</ChipContent>
      {removable && (
        <IconButton
          size={24}
          variant="plain"
          icon="close"
          label={t`Remove`}
          onPress={onRemove}
        />
      )}
    </div>
  );
}

const ChipContent = styled('span', {
  base: {
    paddingInline: '$small',
    paddingBlock: '$xxs',
    textStyle: '$bodySmallSemiBold',
  },
});

const chipStyle = cva({
  base: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'max-content',
    borderRadius: '$full',
    border: '1px solid',
  },
  variants: {
    variant: {
      valid: {
        backgroundColor: '$successMuted',
        borderColor: '$successMutedPressed',
        '&:hover': {
          backgroundColor: '$successMutedHover',
        },
      },
      warning: {
        backgroundColor: '$warnMuted',
        borderColor: '$warnMutedHover', // TODO: Change to warnMutedPressed
        '&:hover': {
          backgroundColor: '$warnMutedHover',
        },
      },
      error: {
        backgroundColor: '$errorMuted',
        borderColor: '$errorMutedPressed',
        '&:hover': {
          backgroundColor: '$errorMutedHover',
        },
      },
      descriptive: {
        backgroundColor: '$primaryMuted',
        borderColor: '$primaryMutedPressed',
        '&:hover': {
          backgroundColor: '$primaryMutedHover',
        },
      },
    },
  },
});
