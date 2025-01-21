import { Trans, useLingui } from '@lingui/react/macro';
import { type FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { PostListDocument, useCreatePostMutation } from '~graphql';
import { useDocumentTitle } from '~hooks/useDocumentTitle';
import { styled } from '~styled-system/jsx';
import { Button, Dialog, Stack, TextArea, TextInput } from '~uikit';

export default function PostCreateRoute() {
  const { t } = useLingui();
  const [formValues, setFormValues] = useState({ title: '', content: '' });
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
        variables: { title: formValues.title, content: formValues.content },
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
                label={t`Title`}
                name="title"
                data-testid="subject-field"
                value={formValues.title}
                onInput={handleChange}
                minLength={5}
                maxLength={500}
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
