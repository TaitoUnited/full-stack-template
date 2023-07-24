import { format } from 'date-fns';

import { Stack, Text } from '~uikit';

type Props = {
  createdAt: string;
  author: string;
  subject: string;
  content: string;
};

export default function PostDetails({
  createdAt,
  author,
  subject,
  content,
}: Props) {
  return (
    <article>
      <Stack direction="column" gap="$medium">
        <Text variant="title1">{subject}</Text>

        <Text variant="bodySmall" color="muted1">
          {format(new Date(createdAt), 'MMM d, yyyy')} | {author}
        </Text>

        <Text variant="body" as="p" lineHeight={1.6}>
          {content}
        </Text>
      </Stack>
    </article>
  );
}
