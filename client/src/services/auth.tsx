import { useEffect } from 'react';
import { hideSplashScreen } from 'vite-plugin-splash-screen/runtime';
import { create } from 'zustand';

import {
  getApolloClient,
  LoginDocument,
  LogoutDocument,
  OrganisationsDocument,
  type OrganisationsQuery,
} from '~graphql';
import { storage } from '~utils/storage';

type AuthState =
  | { status: 'undetermined'; organisation: null }
  | { status: 'determining'; organisation: null }
  | { status: 'logging-in'; organisation: null }
  | { status: 'logging-out'; organisation: string }
  | { status: 'authenticated'; organisation: string }
  | { status: 'unauthenticated'; organisation: null };

const store = create<AuthState>(() => ({
  status: 'undetermined',
  organisation: null,
}));

export async function login(variables: { email: string; password: string }) {
  const apolloClient = getApolloClient();

  store.setState({ status: 'logging-in' });

  try {
    await apolloClient.mutate({ mutation: LoginDocument, variables });

    const organisation = await getUserOrganisation();

    if (!organisation) {
      throw new Error('User does not belong to any organisation');
    }

    storage.clearAll();
    store.setState({ status: 'authenticated', organisation: organisation.id });
  } catch {
    store.setState({ status: 'unauthenticated' });
  }
}

export async function logout() {
  const apolloClient = getApolloClient();

  store.setState({ status: 'logging-out' });

  try {
    await apolloClient.mutate({ mutation: LogoutDocument });
    store.setState({ status: 'unauthenticated' });
    await apolloClient.resetStore();
    storage.clearAll();
  } catch {
    store.setState({ status: 'authenticated' });
  }
}

async function verifyAuth() {
  store.setState({ status: 'determining' });

  try {
    const organisation = await getUserOrganisation();

    if (!organisation) {
      throw new Error('User does not belong to any organisation');
    }

    store.setState({ status: 'authenticated', organisation: organisation.id });
  } catch (_) {
    store.setState({ status: 'unauthenticated' });
  } finally {
    hideSplashScreen();
  }
}

async function getUserOrganisation() {
  const apolloClient = getApolloClient();

  // Try to get the current logged in user
  const result = await apolloClient.query<OrganisationsQuery>({
    query: OrganisationsDocument,
  });

  /**
   * TODO: implement organistaions selection UI.
   * This just automatically selects the first organisation.
   */
  const organisation = result.data.organisations?.[0];

  return organisation;
}

export const useAuthStore = store;
export const authStore = store;

export function useVerifyAuth() {
  const authStatus = useAuthStore(state => state.status);

  useEffect(() => {
    if (authStatus === 'undetermined') {
      verifyAuth();
    }
  }, []);

  return authStatus;
}
