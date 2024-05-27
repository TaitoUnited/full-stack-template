import { Trans } from '@lingui/macro';

import { OutlineButton } from '../Buttons/OutlineButton';
import { FillButton } from '../Buttons/FillButton';
import { styled } from '~styled-system/jsx';

type Props = {
  onConfirm?: () => void;
  onClear?: () => void;
};

export function SelectActions({ onClear, onConfirm }: Props) {
  return (
    <Wrapper>
      {!!onClear && (
        <OutlineButton
          key="clear"
          variant="info"
          onClick={onClear}
          data-test-id="select-actions-clear"
        >
          <Trans>Clear</Trans>
        </OutlineButton>
      )}

      {!!onConfirm && (
        <FillButton
          key="confirm"
          variant="primary"
          onClick={onConfirm}
          data-test-id="select-actions-confirm"
        >
          <Trans>Confirm</Trans>
        </FillButton>
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
