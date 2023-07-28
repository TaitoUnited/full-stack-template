import { SkeletonPlaceholder, Stack } from '~uikit';

export default function PostCreateFallback() {
  return (
    <Stack
      direction="column"
      gap="$large"
      style={{
        maxWidth: 600,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <SkeletonPlaceholder width={340} height={48} borderRadius="small" />
      <Stack direction="column" gap="$normal">
        <SkeletonPlaceholder height={52} borderRadius="normal" />
        <SkeletonPlaceholder height={52} borderRadius="normal" />
        <SkeletonPlaceholder height={112} borderRadius="normal" />
        <SkeletonPlaceholder
          width={116}
          height={44}
          borderRadius="normal"
          style={{ alignSelf: 'flex-end' }}
        />
      </Stack>
    </Stack>
  );
}
