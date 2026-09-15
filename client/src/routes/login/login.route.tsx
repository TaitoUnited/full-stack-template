import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { type SyntheticEvent, useState } from 'react';

import { AlertMessage } from '~/components/common/alert-message';
import { DocumentTitle } from '~/components/common/document-title';
import { login, useAuthStore } from '~/stores/auth-store';
import { styled } from '~/design-system/jsx';
import { Button } from '~/uikit/button';
import { Stack } from '~/uikit/stack';
import { Text } from '~/uikit/text';
import { TextInput } from '~/uikit/text-input';

export const Route = createFileRoute('/login')({
  component: LoginRoute,
  beforeLoad: ({ context }) => {
    if (context.authenticated) {
      redirect({ to: '/', throw: true });
    }
  },
});

function LoginRoute() {
  const { t } = useLingui();

  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [hasLoginError, setHasLoginError] = useState(false);
  const authStatus = useAuthStore(state => state.status);

  const canSubmit =
    credentials.email.trim().length > 0 && credentials.password.length > 0;

  function handleChange(
    event: SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { value, name } = event.currentTarget;
    setCredentials(p => ({ ...p, [name]: value }));
    setHasLoginError(false);
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;

    try {
      await login(credentials);
    } catch (error) {
      console.error('Failed to login', error);
      setHasLoginError(true);
    }
  }

  return (
    <>
      <DocumentTitle title={t`Login`} />
      <Wrapper>
        <LoginForm onSubmit={event => void handleSubmit(event)}>
          <Stack direction="column" gap="large">
            <Text variant="headingXl">
              <Trans>Login</Trans>
            </Text>

            <Stack direction="column" gap="regular">
              <TextInput
                label={t`Email`}
                name="email"
                icon="mail"
                autoComplete="email"
                value={credentials.email}
                onInput={handleChange}
              />

              <TextInput
                label={t`Password`}
                name="password"
                type="password"
                icon="fingerprint"
                autoComplete="current-password"
                value={credentials.password}
                onInput={handleChange}
              />

              {hasLoginError && (
                <div role="alert">
                  <AlertMessage
                    variant="error"
                    message={t`Invalid email or password.`}
                  />
                </div>
              )}

              <Button
                type="submit"
                size="large"
                variant="filled"
                color="primary"
                isLoading={authStatus === 'logging-in'}
                isDisabled={!canSubmit || authStatus === 'logging-in'}
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
    </>
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
