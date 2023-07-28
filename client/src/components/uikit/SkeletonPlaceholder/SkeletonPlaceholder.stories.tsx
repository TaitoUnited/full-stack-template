import SkeletonPlaceholder from './index';
import { styled } from '~styled-system/jsx';
import { Stack } from '~uikit';

export default {
  title: 'SkeletonPlaceholder',
  component: SkeletonPlaceholder,
};

export function Example() {
  return (
    <Wrapper>
      <Stack direction="column" gap="$xlarge">
        <SkeletonPlaceholder width={400} height={40} borderRadius="small" />

        <Stack direction="row" gap="$xlarge">
          <SkeletonPlaceholder width={200} height={200} borderRadius="full" />
          <Stack direction="column" gap="$large" style={{ flexGrow: 1 }}>
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

const Wrapper = styled('div', {
  base: {
    backgroundColor: '$surface',
    padding: '$large',
  },
});
