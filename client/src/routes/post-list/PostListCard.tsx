import { format } from 'date-fns';

import { Text, Icon, Stack } from '~uikit';
import { styled } from '~styled-system/jsx';

type Props = {
  createdAt: string;
  subject: string;
};

export function PostListCard({ createdAt, subject }: Props) {
  return (
    <Wrapper>
      <Stack
        direction="row"
        gap="regular"
        justify="space-between"
        align="center"
      >
        <Stack direction="column" gap="xs">
          <Subject variant="body">{subject}</Subject>

          <Text variant="bodySmall" color="neutral1">
            {format(new Date(createdAt), 'MMM d, yyyy')}
          </Text>
        </Stack>

        <Icon name="chevronRight" size={24} color="neutral4" />
      </Stack>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  base: {
    padding: '$regular',
    borderRadius: '$regular',
    backgroundColor: '$surface',
    boxShadow: '$small',
  },
});

const Subject = styled(Text, {
  base: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '100%',
    zIndex: 1,
    lineHeight: 1.2 /* to prevent text from overlapping, caused by the overflow */,
  },
});
