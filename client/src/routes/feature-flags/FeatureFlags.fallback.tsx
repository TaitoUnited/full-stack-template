import { Stack, SkeletonPlaceholder } from '~uikit';

export default function FeatureFlagsFallback() {
  return (
    <Stack direction="column" gap="$xlarge">
      <Stack direction="column" gap="$normal">
        <SkeletonPlaceholder width={140} height={48} borderRadius="small" />
        <SkeletonPlaceholder width={300} height={24} borderRadius="small" />
        <SkeletonPlaceholder width={600} height={24} borderRadius="small" />
      </Stack>
    </Stack>
  );
}
