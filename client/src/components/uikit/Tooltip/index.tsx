import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useRef, CSSProperties, ReactNode } from 'react';
import { useTooltipTriggerState } from 'react-stately';

import {
  useTooltip,
  useTooltipTrigger,
  useFocusVisible,
  mergeProps,
} from 'react-aria';

type Props = {
  title: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  isDisabled?: boolean;
  triggerStyle?: CSSProperties;
  children: ReactNode;
  customContent?: ReactNode;
};

export default function Tooltip({
  title,
  position = 'bottom',
  isDisabled = false,
  triggerStyle,
  customContent,
  children,
  ...rest
}: Props) {
  const ref = useRef<any>();
  const state = useTooltipTriggerState({ delay: 400 });
  const tooltipTrigger = useTooltipTrigger({ isDisabled }, state, ref);

  const tooltip = useTooltip(
    { 'aria-label': customContent ? title : undefined },
    state
  );

  const tooltipProps = mergeProps(
    tooltipTrigger.tooltipProps,
    tooltip.tooltipProps
  ) as any;

  // HACK: https://github.com/adobe/react-spectrum/issues/1301#issuecomment-737378129
  useFocusVisible();

  return (
    <Wrapper {...rest}>
      <span ref={ref} {...tooltipTrigger.triggerProps} style={triggerStyle}>
        {children}
      </span>

      {state.isOpen && (
        <TooltipWrapper
          {...tooltipProps}
          initial={{ opacity: 0, scale: 0.8, ...positionProps[position] }}
          animate={{ opacity: 1, scale: 1, ...positionProps[position] }}
          exit={{ opacity: 0, scale: 0, ...positionProps[position] }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
        >
          {customContent || <TooltipContent>{title}</TooltipContent>}
        </TooltipWrapper>
      )}
    </Wrapper>
  );
}

const positionProps = {
  top: { x: '-50%', y: '-8px', bottom: '100%' },
  bottom: { x: '-50%', y: '8px', top: '100%' },
  left: { y: '-50%', x: 'calc(-100% - 8px)', top: '50%', left: '0px' },
  right: { y: '-50%', x: 'calc(100% + 8px)', top: '50%', right: '0px' },
};

const Wrapper = styled.span`
  position: relative;
  display: inline-block;
`;

const TooltipWrapper = styled(motion.span)`
  display: inline-flex;
  position: absolute;
  left: 50%;
  z-index: 999;
`;

const TooltipContent = styled.span`
  display: inline-flex;
  color: ${p => p.theme.colors.text};
  background-color: ${p => p.theme.colors.elevated};
  box-shadow: ${p => p.theme.shadows.small};
  padding: ${p => p.theme.spacing.xsmall}px ${p => p.theme.spacing.small}px;
  border-radius: ${p => p.theme.radii.full}px;
  white-space: nowrap;
  line-height: 1;
  ${p => p.theme.typography.bodySmall}
`;
