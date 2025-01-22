import { useEffect } from 'react';
import { create } from 'zustand';

import { getApolloClient } from '~graphql';
import { LoginMutation, LogoutMutation } from '~graphql/session/mutations';
import { MeQuery } from '~graphql/session/queries';
import { getRouter } from '~route-setup';
import { storage } from '~utils/storage';

type AuthState =
  | { status: 'undetermined' }
  | { status: 'determining' }
  | { status: 'logging-in' }
  | { status: 'logging-out' }
  | { status: 'authenticated' }
  | { status: 'unauthenticated' };

const store = create<AuthState>(() => ({ status: 'undetermined' }));

export async function login(variables: { email: string; password: string }) {
  store.setState({ status: 'logging-in' });

  const apolloClient = getApolloClient();
  const router = getRouter();

  try {
    await apolloClient.mutate({ mutation: LoginMutation, variables });

    storage.clearAll();
    store.setState({ status: 'authenticated' });
    router.navigate({ to: '/' });
  } catch {
    store.setState({ status: 'unauthenticated' });
  }
}

export async function logout() {
  store.setState({ status: 'logging-out' });

  const apolloClient = getApolloClient();
  const router = getRouter();

  try {
    store.setState({ status: 'unauthenticated' });
    await apolloClient.mutate({ mutation: LogoutMutation });
    await router.invalidate(); // this will cause redirect to /login
    await apolloClient.clearStore();
    storage.clearAll();
  } catch (e) {
    store.setState({ status: 'authenticated' });
    console.error('> Error logging out', e);
  }
}

export async function verifyAuth() {
  // If we know the user is authenticated or unauthenticated, return early
  if (authStore.getState().status !== 'undetermined') return;

  const apolloClient = getApolloClient();

  const { data } = await apolloClient.query({
    query: MeQuery,
    fetchPolicy: 'cache-first',
  });

  let authenticated = false;

  if (data.me) {
    authenticated = !!data.me.id;
  }

  authStore.setState({
    status: authenticated ? 'authenticated' : 'unauthenticated',
  });
}

export const useAuthStore = store;
export const authStore = store;

export function useVerifyAuth() {
  const authStatus = useAuthStore(state => state.status);
  console.log('authStatus', authStatus);
  useEffect(() => {
    if (authStatus === 'undetermined') {
      verifyAuth();
    }
  }, []);

  return authStatus;
}
