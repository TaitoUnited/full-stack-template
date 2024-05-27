import { ComponentProps } from 'react';
import { Trans } from '@lingui/macro';

import { Button } from '../Button';
import { styled } from '~styled-system/jsx';

type Props = {
  onConfirm?: ComponentProps<typeof Button>['onPress'];
  onClear?: ComponentProps<typeof Button>['onPress'];
};

export function SelectActions({ onClear, onConfirm }: Props) {
  return (
    <Wrapper>
      {!!onClear && (
        <Button
          key="clear"
          color="primary"
          variant="plain"
          onPress={onClear}
          data-test-id="select-actions-clear"
        >
          <Trans>Clear</Trans>
        </Button>
      )}

      {!!onConfirm && (
        <Button
          key="confirm"
          color="primary"
          variant="filled"
          onPress={onConfirm}
          data-test-id="select-actions-confirm"
        >
          <Trans>Confirm</Trans>
        </Button>
      )}
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  base: {
    marginTop: '$xs',
    display: 'flex',
    justifyContent: 'space-evenly',
    gap: '$xs',

    '& button': {
      flex: 1,
    },
  },
});
