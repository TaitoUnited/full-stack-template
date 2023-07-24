import { random, range } from 'lodash';
import { SkeletonPlaceholder, Stack } from '~uikit';

// Define text rows outside of placeholder component so that the random widths
// don't change between renders
const rows = range(20).map(i => (
  <SkeletonPlaceholder
    key={i}
    height={16}
    borderRadius="small"
    width={`${random(60, 95)}%`}
  />
));

export default function PostFallback() {
  return (
    <Stack direction="column" gap="$medium">
      <SkeletonPlaceholder width={400} height={48} borderRadius="normal" />
      <SkeletonPlaceholder width={150} height={12} borderRadius="small" />
      <Stack direction="column" gap="$xsmall">
        {rows}
      </Stack>
    </Stack>
  );
}
