import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { t, Trans } from '@lingui/macro';

import { styled } from '~styled-system/jsx';
import { useDocumentTitle } from '~hooks/useDocumentTitle';
import { TextInput, Stack, Dialog, TextArea, Button } from '~uikit';
import { PostListDocument, useCreatePostMutation } from '~graphql';

export default function PostCreateRoute() {
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
    <Dialog placement="middle" isOpen onOpenChange={() => navigate('/blog')}>
      <Dialog.Header title={t`New blog post`} />
      <Dialog.Body>
        <Wrapper>
          <form onSubmit={handleSubmit}>
            <Stack direction="column" gap="regular">
              <TextInput
                label={t`Subject`}
                name="subject"
                data-testid="subject-field"
                value={formValues.subject}
                onInput={handleChange}
                minLength={5}
                maxLength={500}
              />

              <TextInput
                label={t`Author`}
                name="author"
                data-testid="author-field"
                value={formValues.author}
                onInput={handleChange}
                minLength={2}
                maxLength={100}
              />

              <TextArea
                label={t`Content`}
                name="content"
                data-testid="content-field"
                value={formValues.content}
                onInput={handleChange}
                rows={4}
              />

              <Button
                type="submit"
                variant="filled"
                color="primary"
                isLoading={createPostState.loading}
                isDisabled={submitDisabled}
                style={{ alignSelf: 'flex-end' }}
                data-testid="submit-post"
              >
                {createPostState.loading ? (
                  <Trans>Creating</Trans>
                ) : (
                  <Trans>Create</Trans>
                )}
              </Button>
            </Stack>
          </form>
        </Wrapper>
      </Dialog.Body>
    </Dialog>
  );
}

const Wrapper = styled('div', {
  base: {
    width: 'calc(100vw - token($spacing.large) * 2)',
    maxWidth: '500px',
    padding: '$large',
  },
});
