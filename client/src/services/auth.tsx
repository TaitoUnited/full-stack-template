import { hideSplashScreen } from 'vite-plugin-splash-screen/runtime';
import { useApolloClient } from '@apollo/client';

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';

import { sleep } from '~utils/promise';
import { storage } from '~utils/storage';

type AuthStatus =
  | 'undetermined'
  | 'determining'
  | 'logging-in'
  | 'logging-out'
  | 'authenticated'
  | 'unauthenticated';

type AuthContextValue = {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  verifyAuth: () => Promise<void>;
  status: AuthStatus;
};

const AuthContext = createContext<undefined | AuthContextValue>(undefined); // prettier-ignore

/**
 * TODO: update auth to not use localStorage for storing tokens!
 * We should use secure cookies with the HttpOnly flag for storing tokens.
 */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('undetermined');
  const apolloClient = useApolloClient();

  async function login(credentials: { email: string; password: string }) {
    try {
      setStatus('logging-in');

      const tokens = await fakeLogin(credentials);
      if (!tokens) throw Error('Access token missing!');

      storage.clearAll();
      storage.set('@app/tokens', tokens);
      setStatus('authenticated');
    } catch (error) {
      console.log('> Failed to login', error);
      setStatus('unauthenticated');
    }
  }

  async function logout() {
    try {
      setStatus('logging-out');
      await fakeLogout();
    } catch (error) {
      console.log('> Failed to logout', error);
    } finally {
      // Logout the user even if the network call failed
      setStatus('unauthenticated');
      await apolloClient.resetStore();
      storage.clearAll();
    }
  }

  async function verifyAuth() {
    setStatus('determining');

    try {
      const tokens = storage.get('@app/tokens');

      if (tokens.accessToken) {
        await fakeTestTokens(); // Test if tokens are still valid
        setStatus('authenticated');
      } else {
        await logout();
      }
    } catch (error) {
      setStatus('unauthenticated');
    } finally {
      hideSplashScreen();
    }
  }

  return (
    <AuthContext.Provider value={{ verifyAuth, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('Missing AuthProvider!');
  return context;
}

export function useVerifyAuth() {
  const { verifyAuth, status } = useAuth();

  useEffect(() => {
    if (status === 'undetermined') {
      verifyAuth();
    }
  }, []); // eslint-disable-line

  return status;
}

// ----------------------------------------------------------------------------
// TODO: remove these fake login/logout functions and implement them for real
async function fakeLogin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  console.log('> Doing fake login...', email, password);
  await sleep(2000);
  return {
    accessToken: 'fullstack-templete-access-token',
    refreshToken: 'fullstack-templete-refresh-token',
  };
}

async function fakeLogout() {
  console.log('> Doing fake logout...');
  await sleep(2000);
}

async function fakeTestTokens() {
  await sleep(1000);
}
