import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { t, Trans } from '@lingui/macro';

import { styled } from '~styled-system/jsx';
import { useDocumentTitle } from '~utils/routing';
import { Text, TextInput, Stack, FillButton, Modal, TextArea } from '~uikit';
import { PostListDocument, useCreatePostMutation } from '~graphql';

export default function PostCreatePage() {
  const [formValues, setFormValues] = useState({
    subject: '',
    author: '',
    content: '',
  });

  const submitDisabled = Object.values(formValues).some(p => !p);
  const [createPost, createPostState] = useCreatePostMutation();
  const navigate = useNavigate();

  function handleChange(
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { value, name } = event.currentTarget;
    setFormValues(p => ({ ...p, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitDisabled) return;

    try {
      await createPost({
        variables: {
          subject: formValues.subject,
          author: formValues.author,
          content: formValues.content,
        },
        refetchQueries: [PostListDocument],
      });

      navigate('/blog');

      toast.success(t`New blog post added`);
    } catch (error) {
      console.log('> Failed to create a new post', error);
      toast.error(t`Failed to add new blog post`);
    }
  }

  useDocumentTitle(t`New blog post`);

  return (
    <Modal title={t`New blog post`} onClose={() => navigate('/blog')}>
      <Wrapper>
        <Stack direction="column" gap="$large">
          <Text variant="bodyLargeBold">
            <Trans>New blog post</Trans>
          </Text>

          <form onSubmit={handleSubmit}>
            <Stack direction="column" gap="$normal">
              <TextInput
                label={t`Subject`}
                name="subject"
                data-test-id="subject-field"
                value={formValues.subject}
                onInput={handleChange}
                minLength={5}
                maxLength={500}
              />

              <TextInput
                label={t`Author`}
                name="author"
                data-test-id="author-field"
                value={formValues.author}
                onInput={handleChange}
                minLength={2}
                maxLength={100}
              />

              <TextArea
                label={t`Content`}
                name="content"
                data-test-id="content-field"
                value={formValues.content}
                onInput={handleChange}
                rows={4}
              />

              <FillButton
                type="submit"
                variant="primary"
                loading={createPostState.loading}
                disabled={submitDisabled}
                style={{ alignSelf: 'flex-end' }}
                data-test-id="submit-post"
              >
                {createPostState.loading ? (
                  <Trans>Creating</Trans>
                ) : (
                  <Trans>Create</Trans>
                )}
              </FillButton>
            </Stack>
          </form>
        </Stack>
      </Wrapper>
    </Modal>
  );
}

const Wrapper = styled('div', {
  base: {
    width: 'calc(100vw - token(spacing.$large) * 2)',
    maxWidth: '500px',
    padding: '$large',
  },
});
