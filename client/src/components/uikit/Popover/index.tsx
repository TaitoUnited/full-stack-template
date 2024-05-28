import { CSSProperties, forwardRef, ReactNode } from 'react';

import {
  Button as AriaButton,
  Popover as AriaPopover,
  Dialog,
  DialogTrigger,
  OverlayArrow,
  PopoverProps,
} from 'react-aria-components';

import './styles.css';
import { cva, cx } from '~styled-system/css';
import { styled } from '~styled-system/jsx';

type Props = PopoverProps & {
  content: ReactNode;
  children: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  style?: CSSProperties;
};

// Based on https://react-spectrum.adobe.com/react-aria/useOverlayTrigger.html

export const PopoverBase = forwardRef<HTMLDivElement, Props>(
  ({ content, children, placement, className, ...rest }, ref) => {
    return (
      <DialogTrigger>
        {children}
        <AriaPopover
          ref={ref}
          offset={14}
          placement={placement}
          // NOTE: enter/exit animations can be tricky with Framer Motion
          // when using React Aria components, so we're using the animation
          // helpers provided by React Aria with pure CSS animations instead.
          className={({ isEntering, isExiting }) =>
            cx(popoverStyles({ isEntering, isExiting }), className)
          }
          {...rest}
        >
          <PopoverArrow>
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path
                d="M6.89443 10.2111L11.2764 1.44722C11.6088 0.782313 11.1253 8.7721e-07 10.382 8.12221e-07L1.61803 4.60539e-08C0.874652 -1.89346e-08 0.391155 0.782312 0.723606 1.44721L5.10557 10.2111C5.4741 10.9482 6.5259 10.9482 6.89443 10.2111Z"
                className="arrow-bg"
              />
              <path
                d="M1 1L6 11"
                className="arrow-stroke"
                strokeLinecap="round"
              />
              <path
                d="M11 1L6 11"
                className="arrow-stroke"
                strokeLinecap="round"
              />
            </svg>
          </PopoverArrow>
          <PopoverDialog>{content}</PopoverDialog>
        </AriaPopover>
      </DialogTrigger>
    );
  }
);

PopoverBase.displayName = 'Popover';

const popoverStyles = cva({
  base: {
    '--shadow': '0px 2px 10px rgba(0, 0, 0, 0.1)',
    '--animation-in': 'popover-animate-in-from-top',
    boxShadow: 'var(--shadow)',
    backgroundColor: '$surface',
    borderRadius: '$regular',
    borderWidth: '1px',
    borderColor: '$neutral4',
    padding: '$regular',

    '&[data-placement="bottom"]': {
      '--shadow': '0px -2px 10px rgba(0, 0, 0, 0.1)',
      '--animation-in': 'popover-animate-in-from-bottom',
    },
    '&[data-placement="right"]': {
      '--shadow': '-2px 2px 10px rgba(0, 0, 0, 0.1)',
      '--animation-in': 'popover-animate-in-from-right',
    },
    '&[data-placement="left"]': {
      '--shadow': '2px 2px 10px rgba(0, 0, 0, 0.1)',
      '--animation-in': 'popover-animate-in-from-left',
    },
  },
  variants: {
    isEntering: {
      true: {
        animation: 'var(--animation-in) 150ms ease-out forwards',
      },
    },
    isExiting: {
      true: {
        animation: 'popover-animate-out 100ms ease-in forwards',
      },
    },
  },
});

const PopoverDialog = styled(Dialog, {
  base: {
    outline: 'none',
  },
});

const PopoverArrow = styled(OverlayArrow, {
  base: {
    display: 'inline-flex',
    zIndex: 1,

    '& .arrow-bg': {
      fill: '$surface',
    },

    '& .arrow-stroke': {
      stroke: '$neutral4',
    },

    // NOTE: offset the arrow by 1px so that it overlaps with the border

    '&[data-placement="top"]': {
      marginTop: '-1px',
    },

    '&[data-placement="bottom"]': {
      marginBottom: '-1px',
      '& svg': {
        transform: 'rotate(180deg)',
      },
    },

    '&[data-placement="right"]': {
      marginRight: '-1px',
      '& svg': {
        transform: 'rotate(90deg)',
      },
    },

    '&[data-placement="left"]': {
      marginLeft: '-1px',
      '& svg': {
        transform: 'rotate(-90deg)',
      },
    },
  },
});

/**
 * Use this when the wrapped element is not a button-like element.
 * React Aria requires the trigger to be a button-like element,
 * otherwise the tooltip won't show up.
 */
const PopoverTrigger = styled(AriaButton, {
  base: {
    all: 'unset',
  },
});

export const Popover = Object.assign(PopoverBase, {
  Trigger: PopoverTrigger,
});
