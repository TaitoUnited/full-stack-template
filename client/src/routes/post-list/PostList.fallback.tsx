import { range } from 'lodash';

import { SkeletonPlaceholder, Stack } from '~uikit';

export default function PostListFallback() {
  return (
    <Stack direction="column" gap="large">
      <SkeletonPlaceholder width={130} height={48} borderRadius="small" />
      <Stack direction="column" gap="regular">
        {range(20).map(i => (
          <SkeletonPlaceholder key={i} height={68} borderRadius="regular" />
        ))}
      </Stack>
    </Stack>
  );
}
