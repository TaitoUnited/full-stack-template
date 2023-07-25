import { FormEvent, useState } from 'react';
import { t, Trans } from '@lingui/macro';

import { styled } from '~styled-system/jsx';
import { Text, TextInput, Stack, FillButton } from '~uikit';
import { useDocumentTitle } from '~utils/routing';
import { useAuth } from '~services/auth';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const auth = useAuth();

  function handleChange(
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { value, name } = event.currentTarget;
    setCredentials(p => ({ ...p, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    auth.login(credentials);
  }

  useDocumentTitle(t`Login`);

  return (
    <Wrapper>
      <LoginForm onSubmit={handleSubmit}>
        <Stack direction="column" gap="$large">
          <Text variant="title1">
            <Trans>Login</Trans>
          </Text>

          <Stack direction="column" gap="$normal">
            <TextInput
              label={t`Email`}
              name="email"
              icon="envelopeFilled"
              value={credentials.email}
              onInput={handleChange}
            />
            <TextInput
              label={t`Password`}
              name="password"
              type="password"
              icon="lock"
              value={credentials.password}
              onInput={handleChange}
            />
            <FillButton
              type="submit"
              variant="primary"
              loading={auth.status === 'logging-in'}
              data-test-id="login"
            >
              {auth.status === 'logging-in' ? (
                <Trans>Logging in</Trans>
              ) : (
                <Trans>Submit</Trans>
              )}
            </FillButton>
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
  },
});

const LoginForm = styled('form', {
  base: {
    minWidth: '450px',
    padding: '$xxlarge',
    backgroundColor: '$surface',
    borderRadius: '$normal',
    boxShadow: '$large',
  },
});
