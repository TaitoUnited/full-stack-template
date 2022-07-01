import { SkeletonPlaceholder, Stack } from '~uikit';

export default function PostCreateFallback() {
  return (
    <Stack
      axis="y"
      spacing="large"
      style={{
        maxWidth: 600,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <SkeletonPlaceholder width={340} height={48} borderRadius="small" />
      <Stack axis="y" spacing="normal">
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
