import { range } from 'lodash';

import { SkeletonPlaceholder, Stack } from '~uikit';

export default function PostListFallback() {
  return (
    <Stack axis="y" spacing="large">
      <SkeletonPlaceholder width={130} height={48} borderRadius="small" />
      <Stack axis="y" spacing="normal">
        {range(20).map(i => (
          <SkeletonPlaceholder key={i} height={68} borderRadius="normal" />
        ))}
      </Stack>
    </Stack>
  );
}
