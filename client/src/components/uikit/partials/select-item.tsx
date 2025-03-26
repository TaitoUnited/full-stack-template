import type { ReactNode } from 'react';
import { Text } from 'react-aria-components';

import { css } from '~/styled-system/css';

import { Stack } from '../stack';
import { SelectedIcon } from './common';

type Props = {
  label: string;
  render?: (label: ReactNode) => ReactNode;
  description?: string;
};

export function SelectItem({ label, description, render }: Props) {
  return (
    <Stack direction="row" gap="$small" align="center" justify="space-between">
      <Stack direction="column" gap="$xxs">
        {render ? (
          render(<LabelWrapper>{label}</LabelWrapper>)
        ) : (
          <LabelWrapper>{label}</LabelWrapper>
        )}

        {!!description && (
          <Text slot="description" className={descriptionStyles}>
            {description}
          </Text>
        )}
      </Stack>
      <SelectedIcon />
    </Stack>
  );
}

function LabelWrapper({ children }: { children: ReactNode }) {
  return (
    <Text slot="label" className={labelStyles}>
      {children}
    </Text>
  );
}

const labelStyles = css({
  textStyle: '$label',
  lineHeight: '1.4',
});

const descriptionStyles = css({
  textStyle: 'bodyExtraSmall',
  color: '$textMuted',
});
