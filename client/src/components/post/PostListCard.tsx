import styled from 'styled-components';
import { format } from 'date-fns';
import { HiChevronRight } from 'react-icons/hi';

import { Text, Stack, Icon } from '~uikit';

type Props = {
  createdAt: string;
  subject: string;
};

export default function PostListCard({ createdAt, subject }: Props) {
  return (
    <Wrapper>
      <Stack axis="x" spacing="normal" justify="space-between" align="center">
        <Stack axis="y" spacing="xsmall">
          <Text variant="body">{subject}</Text>

          <Text variant="bodySmall" color="muted1">
            {format(new Date(createdAt), 'MMM d, yyyy')}
          </Text>
        </Stack>

        <Icon icon={HiChevronRight} size="normal" color="muted4" />
      </Stack>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: ${p => p.theme.spacing.normal}px;
  border-radius: ${p => p.theme.radii.normal}px;
  background-color: ${p => p.theme.colors.surface};
  box-shadow: ${p => p.theme.shadows.small};
`;
