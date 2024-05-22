import { range } from 'lodash';

import { styled } from '~styled-system/jsx';
import { Stack, SkeletonPlaceholder } from '~uikit';

export default function HomeFallback() {
  return (
    <Stack direction="column" gap="$xl">
      <Stack direction="column" gap="$regular">
        <SkeletonPlaceholder width={140} height={48} borderRadius="small" />
        <SkeletonPlaceholder width={300} height={24} borderRadius="small" />
        <SkeletonPlaceholder width={600} height={24} borderRadius="small" />
        <SkeletonPlaceholder width={700} height={48} borderRadius="small" />
      </Stack>

      <Stack direction="column" gap="$medium">
        <SkeletonPlaceholder width={150} height={32} borderRadius="small" />
        <SkeletonPlaceholder width={600} height={24} borderRadius="small" />
      </Stack>

      <Stack direction="column" gap="$medium">
        <SkeletonPlaceholder width={150} height={32} borderRadius="small" />

        <Cards>
          {range(8).map(i => (
            <SkeletonPlaceholder
              key={i}
              width="100%"
              height={255}
              borderRadius="regular"
            />
          ))}
        </Cards>
      </Stack>
    </Stack>
  );
}

const Cards = styled('div', {
  base: {
    display: 'grid',
    gridGap: '$regular',
    gridTemplateColumns: '50% 50%',
  },
});
