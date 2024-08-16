import { HTMLAttributes, ReactNode } from 'react';

import {
  Button as AriaButton,
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  OverlayArrow,
  TooltipTriggerComponentProps,
} from 'react-aria-components';

import { styled } from '~styled-system/jsx';

type Props = Omit<HTMLAttributes<HTMLDivElement>, 'content'> &
  TooltipTriggerComponentProps & {
    content: ReactNode;
    children: ReactNode;
    placement?: 'top' | 'bottom' | 'left' | 'right';
  };

const ARROW_OFFSET = 8;

const TooltipBase = ({
  children,
  content,
  placement = 'top',
  delay = 300,
  closeDelay = 100,
  className,
  style,
  ...rest
}: Props) => {
  return (
    <AriaTooltipTrigger
      {...rest}
      delay={delay}
      closeDelay={closeDelay}
      data-testid="tooltip"
    >
      {children}
      <TooltipContent
        style={style}
        className={className}
        placement={placement}
        offset={ARROW_OFFSET}
        data-testid="tooltip-content"
      >
        <TooltipArrow>
          <svg width={8} height={8} viewBox="0 0 8 8">
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </TooltipArrow>
        {content}
      </TooltipContent>
    </AriaTooltipTrigger>
  );
};

const TooltipContent = styled(AriaTooltip, {
  base: {
    backgroundColor: '$text',
    paddingBlock: '$xs',
    paddingInline: '$small',
    borderRadius: '$regular',
    color: '$neutral5',
    outline: 'none',
    textStyle: '$bodySmall',
    boxShadow: '$regular',
  },
});

const TooltipArrow = styled(OverlayArrow, {
  base: {
    display: 'inline-flex',

    '& svg': {
      fill: '$text',
    },

    '&[data-placement="bottom"] svg': {
      transform: 'rotate(180deg)',
    },

    '&[data-placement="right"] svg': {
      transform: 'rotate(90deg)',
    },

    '&[data-placement="left"] svg': {
      transform: 'rotate(-90deg)',
    },
  },
});

/**
 * Use this when the wrapped element is not a button-like element.
 * React Aria requires the trigger to be a button-like element,
 * otherwise the tooltip won't show up.
 */
const TooltipTrigger = styled(AriaButton, {
  base: {
    all: 'unset',
  },
});

export const Tooltip = Object.assign(TooltipBase, {
  Trigger: TooltipTrigger,
});
