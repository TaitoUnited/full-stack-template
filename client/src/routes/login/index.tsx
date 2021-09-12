import styled from 'styled-components';
import { useState } from 'react';
import { t, Trans } from '@lingui/macro';
import { HiOutlineMail, HiLockClosed } from 'react-icons/hi';

import { Text, TextInput, Stack, FillButton } from '~uikit';
import { useDocumentTitle } from '~utils/routing';
import { useAuth } from '~services/auth';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const auth = useAuth();

  function handleChange(event: any) {
    const { value, name } = event.target;
    setCredentials(p => ({ ...p, [name]: value }));
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    auth.login(credentials);
  }

  useDocumentTitle(t`Login`);

  return (
    <Wrapper>
      <LoginForm onSubmit={handleSubmit}>
        <Stack axis="y" spacing="large">
          <Text variant="title1">
            <Trans>Login</Trans>
          </Text>

          <Stack axis="y" spacing="normal">
            <TextInput
              label={t`Email`}
              name="email"
              icon={HiOutlineMail}
              value={credentials.email}
              onChange={handleChange}
            />
            <TextInput
              label={t`Password`}
              name="password"
              type="password"
              icon={HiLockClosed}
              value={credentials.password}
              onChange={handleChange}
            />
            <FillButton
              type="submit"
              variant="primary"
              loading={auth.status === 'logging-in'}
              testId="login"
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

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginForm = styled.form`
  min-width: 450px;
  padding: ${p => p.theme.spacing.xxlarge}px;
  background-color: ${p => p.theme.colors.surface};
  border-radius: ${p => p.theme.radii.normal}px;
  box-shadow: ${p => p.theme.shadows.large};
`;
