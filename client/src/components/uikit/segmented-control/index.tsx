import type { Ref } from 'react';
import {
  type Key,
  ToggleButton,
  ToggleButtonGroup,
  type ToggleButtonGroupProps,
} from 'react-aria-components';

import { css, cx } from '~/styled-system/css';

import { Icon, type IconName } from '../icon';

type AriaProps = Omit<
  ToggleButtonGroupProps,
  'selectionMode' | 'selectedKeys' | 'onSelectionChange' | 'className'
>;

type Segment = {
  id: string;
  label: string;
  icon?: IconName;
  disabled?: boolean;
};

type Props = AriaProps & {
  ref?: Ref<HTMLDivElement>;
  className?: string;
  value: string;
  segments: Segment[];
  onChange: (value: string) => void;
};

export function SegmentedControl({
  ref,
  className,
  value,
  segments,
  onChange,
  ...rest
}: Props) {
  function handleChange(values: Set<Key>) {
    // React Aria uses `Set` which is kindah annoying...
    const value = Array.from(values)[0] as string;
    onChange(value);
  }

  return (
    <ToggleButtonGroup
      ref={ref}
      selectionMode="single"
      selectedKeys={new Set([value])}
      onSelectionChange={handleChange}
      disallowEmptySelection
      className={cx(buttonGroupStyles, className)}
      {...rest}
    >
      {segments.map(({ id, label, icon, disabled }) => (
        <ToggleButton
          key={id}
          id={id}
          className={buttonStyles}
          isDisabled={disabled}
        >
          {icon && <Icon name={icon} size={18} color="text" />}
          {/* Align text visually vertically with the icon */}
          <span style={{ transform: 'translateY(1px)' }}>{label}</span>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

const buttonGroupStyles = css({
  '--padding': '2px',
  display: 'flex',
  gap: '1px',
  width: 'fit-content',
  backgroundColor: '$neutral4',
  borderRadius: 'calc({$radii.small} + var(--padding))',
  padding: 'var(--padding)',
});

const buttonStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '$xxs',
  lineHeight: '1',
  paddingBlock: '$xs',
  paddingInline: '$small',
  border: 'none',
  borderRadius: '$small',
  backgroundColor: '$neutral4',
  color: '$text',
  textStyle: '$bodySemiBold',
  transition: 'background-color 0.2s',

  '&[aria-checked="true"]': {
    backgroundColor: '$surface',
  },
  '&[disabled]': {
    cursor: 'not-allowed',
    color: '$textMuted',
  },
  '&:not([disabled]):hover': {
    backgroundColor: '$neutral5',
  },
  '&[data-focus-visible]': {
    $focusRing: true,
    zIndex: 1,
  },
});
