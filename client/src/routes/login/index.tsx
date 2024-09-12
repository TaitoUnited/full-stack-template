import { FormEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { t, Trans } from '@lingui/macro';

import { styled } from '~styled-system/jsx';
import { Text, TextInput, Stack, Button } from '~uikit';
import { useDocumentTitle } from '~hooks/useDocumentTitle';
import { login, useAuthStore } from '~services/auth';

export default function LoginRoute() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const authStatus = useAuthStore(state => state.status);

  function handleChange(
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { value, name } = event.currentTarget;
    setCredentials(p => ({ ...p, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login(credentials);
  }

  useDocumentTitle(t`Login`);

  if (authStatus === 'authenticated') {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <Wrapper>
      <LoginForm onSubmit={handleSubmit}>
        <Stack direction="column" gap="large">
          <Text variant="headingXl">
            <Trans>Login</Trans>
          </Text>

          <Stack direction="column" gap="regular">
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
