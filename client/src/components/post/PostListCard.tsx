import styled from 'styled-components';
import { format } from 'date-fns';

import { Text, Stack, Icon } from '~uikit';

type Props = {
  createdAt: string;
  subject: string;
};

export default function PostListCard({ createdAt, subject }: Props) {
  return (
    <Wrapper>
      <Stack direction="row" gap="normal" justify="space-between" align="center">
        <PostInfo direction="column" gap="xsmall">
          <Subject variant="body">{subject}</Subject>

          <Text variant="bodySmall" color="muted1">
            {format(new Date(createdAt), 'MMM d, yyyy')}
          </Text>
        </PostInfo>

        <Icon name="chevronRight" size={24} color="muted4" />
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

const PostInfo = styled(Stack)`
  width: 90%;
`;
const Subject = styled(Text)`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  z-index: 1;
  line-height: 1.2; /* to prevent text from overlapping, caused by the overflow */
`;
