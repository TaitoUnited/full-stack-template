import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  HttpLink,
  InMemoryCache,
  ServerError,
} from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';

import { config } from '~/constants/config';
import { DEFAULT_LOCALE, LOCALE_SCHEMA } from '~/services/i18n';
import { authStore, logout } from '~/stores/auth-store';
import { toast } from '~/uikit/toaster';
import { storage } from '~/utils/storage';
import { setApolloClient } from './apollo-client-store';
import { i18n } from '@lingui/core';
import { msg } from '@lingui/core/macro';

export function setupApolloClient() {
  const cache = new InMemoryCache();

  const httpLink = new HttpLink({ uri: `${config.API_URL}/graphql` });

  const headersLink = new ApolloLink((operation, forward) => {
    const locale = storage.get('locale', LOCALE_SCHEMA) ?? DEFAULT_LOCALE;

    operation.setContext({
      headers: {
        ...getContextHeaders(operation.getContext()),
        'Accept-Language': locale,
      },
    });

    return forward(operation);
  });

  const requestLinks = ApolloLink.from([headersLink, httpLink]);

  // https://www.apollographql.com/docs/react/networking/advanced-http-networking#customizing-response-logic
  const logoutLink = new ErrorLink(({ error }) => {
    const isNetworkAuthError =
      ServerError.is(error) && error.statusCode === 401;

    const isGraphQLAuthError =
      CombinedGraphQLErrors.is(error) &&
      error.errors.some(err => err.extensions?.code === 'UNAUTHORIZED');

    const authState = authStore.getState();

    /**
     * Automatically log out the user if the session has expired and session
     * refreshing has failed on the server for some reason.
     */
    if (
      authState.status === 'authenticated' &&
      (isNetworkAuthError || isGraphQLAuthError)
    ) {
      logout()
        .then(() => toast.info(i18n._(msg`Your session has expired!`)))
        .catch((logoutError: unknown) =>
          console.log('Failed to logout', logoutError)
        ); // this should never happen...
    }
  });

  const apolloClient = new ApolloClient({
    link: logoutLink.concat(requestLinks),
    cache,

    devtools: {
      enabled: process.env.NODE_ENV === 'development',
    },
  });

  setApolloClient(apolloClient);

  return apolloClient;
}

function getContextHeaders(context: unknown): Record<string, unknown> {
  if (
    typeof context !== 'object' ||
    context === null ||
    !('headers' in context) ||
    typeof context.headers !== 'object' ||
    context.headers === null
  ) {
    return {};
  }

  return { ...context.headers };
}
