import styled from 'styled-components';

import SkeletonPlaceholder, { SkeletonPlaceholderProvider } from './index';
import { Stack } from '~uikit';

export default {
  title: 'SkeletonPlaceholder',
  component: SkeletonPlaceholder,
};

export function DefaultBackground() {
  return (
    <Wrapper>
      <Stack direction="column" gap="xxlarge">
        <SkeletonPlaceholder
          width={200}
          height={40}
          borderRadius="small"
          marginTop="normal"
        />

        <Stack direction="row" gap="xxlarge">
          <SkeletonPlaceholder width={200} height={200} borderRadius="full" />
          <Stack direction="column" gap="large" style={{ flexGrow: 1 }}>
            <SkeletonPlaceholder height={200} borderRadius="normal" />
            <SkeletonPlaceholder
              width={500}
              height={100}
              borderRadius="normal"
            />
          </Stack>
        </Stack>
      </Stack>
    </Wrapper>
  );
}

export function CustomBackground() {
  return (
    <SkeletonPlaceholderProvider backgroundColor="primaryMuted">
      <Wrapper>
        <Stack direction="column" gap="xxlarge">
          <SkeletonPlaceholder
            width={200}
            height={40}
            borderRadius="small"
            marginTop="normal"
          />

          <Stack direction="row" gap="xxlarge">
            <SkeletonPlaceholder width={200} height={200} borderRadius="full" />
            <Stack direction="column" gap="large" style={{ flexGrow: 1 }}>
              <SkeletonPlaceholder height={200} borderRadius="normal" />
              <SkeletonPlaceholder
                width={500}
                height={100}
                borderRadius="normal"
              />
            </Stack>
          </Stack>
        </Stack>
      </Wrapper>
    </SkeletonPlaceholderProvider>
  );
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.colors.surface};
  padding: ${p => p.theme.spacing.large}px;
`;
