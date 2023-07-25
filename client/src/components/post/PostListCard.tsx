import { format } from 'date-fns';

import { Text, Icon } from '~uikit';
import { Stack, styled } from '~styled-system/jsx';

type Props = {
  createdAt: string;
  subject: string;
};

export default function PostListCard({ createdAt, subject }: Props) {
  return (
    <Wrapper>
      <Stack
        direction="row"
        gap="$normal"
        justify="space-between"
        align="center"
      >
        <Stack direction="column" gap="$xsmall">
          <Subject variant="body">{subject}</Subject>

          <Text variant="bodySmall" color="muted1">
            {format(new Date(createdAt), 'MMM d, yyyy')}
          </Text>
        </Stack>

        <Icon name="chevronRight" size={24} color="muted4" />
      </Stack>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  base: {
    padding: '$normal',
    borderRadius: '$normal',
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
