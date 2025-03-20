import { format } from 'date-fns';

import { Stack } from '~/uikit/stack';
import { Text } from '~/uikit/text';

type Props = {
  createdAt: string;
  author: string;
  subject: string;
  content: string;
};

export function PostDetails({ createdAt, author, subject, content }: Props) {
  return (
    <article>
      <Stack direction="column" gap="$medium">
        <Text variant="headingXl">{subject}</Text>

        <Text variant="bodySmall" color="neutral1">
          {format(new Date(createdAt), 'MMM d, yyyy')} | {author}
        </Text>

        <Text variant="body" as="p" lineHeight={1.6}>
          {content}
        </Text>
      </Stack>
    </article>
  );
}
