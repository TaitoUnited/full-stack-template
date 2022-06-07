import styled from 'styled-components';
import { range } from 'lodash';

import { Stack, SkeletonPlaceholder } from '~uikit';

export default function HomeFallback() {
  return (
    <Stack axis="y" spacing="xlarge">
      <Stack axis="y" spacing="normal">
        <SkeletonPlaceholder width={140} height={48} borderRadius="small" />
        <SkeletonPlaceholder width={300} height={24} borderRadius="small" />
        <SkeletonPlaceholder width={600} height={24} borderRadius="small" />
        <SkeletonPlaceholder width={700} height={48} borderRadius="small" />
      </Stack>

      <Stack axis="y" spacing="medium">
        <SkeletonPlaceholder width={150} height={32} borderRadius="small" />
        <SkeletonPlaceholder width={600} height={24} borderRadius="small" />
      </Stack>

      <Stack axis="y" spacing="medium">
        <SkeletonPlaceholder width={150} height={32} borderRadius="small" />

        <Cards>
          {range(8).map(i => (
            <SkeletonPlaceholder
              key={i}
              width="100%"
              height={255}
              borderRadius="normal"
            />
          ))}
        </Cards>
      </Stack>
    </Stack>
  );
}

const Cards = styled.div`
  display: grid;
  grid-gap: ${p => p.theme.spacing.normal}px;
  grid-template-columns: 50% 50%;
`;
