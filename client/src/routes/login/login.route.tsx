import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { type FormEvent, useState } from 'react';

import { useDocumentTitle } from '~/hooks/use-document-title';
import { login, useAuthStore } from '~/stores/auth-store';
import { styled } from '~/styled-system/jsx';
import { Button } from '~/uikit/button';
import { Stack } from '~/uikit/stack';
import { Text } from '~/uikit/text';
import { TextInput } from '~/uikit/text-input';
import { toast } from '~/uikit/toaster';

export const Route = createFileRoute('/login')({
  component: LoginRoute,
  beforeLoad: async ({ context }) => {
    if (context.authenticated) {
      throw redirect({ to: '/' });
    }
  },
});

function LoginRoute() {
  const { t } = useLingui();
  useDocumentTitle(t`Login`);

  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const authStatus = useAuthStore(state => state.status);

  function handleChange(
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { value, name } = event.currentTarget;
    setCredentials(p => ({ ...p, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      await login(credentials);
    } catch (error) {
      console.error('Failed to login', error);
      toast.error(t`Failed to login`);
    }
  }

  return (
    <Wrapper>
      <LoginForm onSubmit={handleSubmit}>
        <Stack direction="column" gap="$large">
          <Text variant="headingXl">
            <Trans>Login</Trans>
          </Text>

          <Stack direction="column" gap="$regular">
            <TextInput
              label={t`Email`}
              name="email"
              icon="mail"
              value={credentials.email}
              onInput={handleChange}
            />
            <TextInput
              label={t`Password`}
              name="password"
              type="password"
              icon="fingerprint"
              value={credentials.password}
              onInput={handleChange}
            />
            <Button
              type="submit"
              size="large"
              variant="filled"
              color="primary"
              isLoading={authStatus === 'logging-in'}
              data-testid="login"
            >
              {authStatus === 'logging-in' ? (
                <Trans>Logging in</Trans>
              ) : (
                <Trans>Submit</Trans>
              )}
            </Button>
          </Stack>
        </Stack>
      </LoginForm>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  base: {
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '$neutral5',
  },
});

const LoginForm = styled('form', {
  base: {
    minWidth: '450px',
    padding: '$2xl',
    backgroundColor: '$surface',
    borderRadius: '$regular',
    boxShadow: '$large',
  },
});
