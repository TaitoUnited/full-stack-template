import { useEffect } from 'react';
import { hideSplashScreen } from 'vite-plugin-splash-screen/runtime';
import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { t } from '@lingui/macro';

import { storage } from '~utils/storage';

import {
  LoginDocument,
  LogoutDocument,
  OrganisationsDocument,
  OrganisationsQuery,
  getApolloClient,
} from '~graphql';

type AuthStatus =
  | 'undetermined'
  | 'determining'
  | 'logging-in'
  | 'logging-out'
  | 'authenticated'
  | 'unauthenticated';

const store = create<{
  status: AuthStatus;
  organisation: string | null;
}>(() => ({
  status: 'undetermined',
  organisation: null,
}));

export async function login(variables: { email: string; password: string }) {
  const apolloClient = getApolloClient();

  try {
    store.setState({ status: 'logging-in' });
    await apolloClient.mutate({ mutation: LoginDocument, variables });
    storage.clearAll();
    store.setState({ status: 'authenticated' });
  } catch (error) {
    store.setState({ status: 'unauthenticated' });
    toast.error(t`Failed to login`);
  }
}

export async function logout() {
  const apolloClient = getApolloClient();

  try {
    store.setState({ status: 'logging-out' });
    await apolloClient.mutate({ mutation: LogoutDocument });
    store.setState({ status: 'unauthenticated' });
    await apolloClient.resetStore();
    storage.clearAll();
  } catch (error) {
    console.log('Failed to logout', error);
    toast.error(t`Failed to logout`);
  }
}

async function verifyAuth() {
  const apolloClient = getApolloClient();

  try {
    store.setState({ status: 'determining' });

    // Try to get the current logged in user
    const result = await apolloClient.query<OrganisationsQuery>({
      query: OrganisationsDocument,
    });

    /**
     * TODO: implement organistaions selection UI.
     * This just automatically selects the first organisation.
     */
    const organisation = result.data.organisations?.[0];

    if (organisation) {
      store.setState({
        status: 'authenticated',
        organisation: organisation.id,
      });
    } else {
      store.setState({ status: 'unauthenticated' });
    }
  } catch (_) {
    store.setState({ status: 'unauthenticated' });
  } finally {
    hideSplashScreen();
  }
}

export const useAuthStore = store;
export const authStore = store;

export function useVerifyAuth() {
  const authStatus = useAuthStore(state => state.status);

  useEffect(() => {
    if (authStatus === 'undetermined') {
      verifyAuth();
    }
  }, []); // eslint-disable-line

  return authStatus;
}
