import { Trans, t } from '@lingui/macro';
import { VisuallyHidden } from 'react-aria';

import { Icon } from '../Icon';
import { Spinner } from '../Spinner';
import { IconButton } from '../Buttons/IconButton';
import { styled } from '~styled-system/jsx';

type Props = {
  isLoading: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
};

export function SelectFilterInput({
  isLoading,
  inputValue,
  onInputChange,
}: Props) {
  return (
    <Wrapper>
      <VisuallyHidden>
        <Trans>Search options</Trans>
      </VisuallyHidden>

      <Icon name="search" size={20} color="textMuted" />

      <Input
        autoFocus
        value={inputValue}
        onChange={e => onInputChange(e.target.value)}
        data-test-id="select-filter-input"
      />

      {isLoading ? (
        <SpinnerWrapper>
          <Spinner size="small" color="text" />
        </SpinnerWrapper>
      ) : inputValue ? (
        <IconButton
          icon="close"
          size={24}
          label={t`Clear search filter`}
          onClick={() => onInputChange('')}
          data-test-id="select-filter-input-clear"
        />
      ) : null}
    </Wrapper>
  );
}

const Wrapper = styled('label', {
  base: {
    '--outline-width': '1px',
    padding: '$small',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px', // try to match container border radius
    borderWidth: '1px',
    borderColor: '$line1',
    outlineOffset: 'calc(0px - var(--outline-width))',
    marginBottom: '$xs',

    '&:focus-within': {
      '--outline-width': '2px',
      borderColor: 'transparent',
      outline: 'var(--outline-width) solid token($colors.focusRing)',
    },
  },
});

const Input = styled('input', {
  base: {
    flex: 1,
    marginLeft: '$xs',
    marginRight: '$small',
    textStyle: '$body',
    textAlign: 'left',
  },
});

const SpinnerWrapper = styled('div', {
  base: {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
