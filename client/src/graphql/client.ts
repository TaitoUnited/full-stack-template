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
import { logout } from '~/stores/auth-store';
import { workspaceIdStore } from '~/stores/workspace-store';
import { toast } from '~/uikit/toaster';
import { storage } from '~/utils/storage';

let __apolloClient__: ApolloClient;

export function getApolloClient() {
  return __apolloClient__;
}

export function setupApolloClient() {
  const cache = new InMemoryCache();

  const httpLink = new HttpLink({ uri: `${config.API_URL}/graphql` });

  const headersLink = new ApolloLink((operation, forward) => {
    const locale = storage.get('locale', LOCALE_SCHEMA) ?? DEFAULT_LOCALE;

    operation.setContext({
      headers: {
        ...getContextHeaders(operation.getContext()),
        'Accept-Language': locale,
        'x-organisation-id': workspaceIdStore.getState().workspaceId,
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

    /**
     * Automatically log out the user if the session has expired and session
     * refreshing has failed on the server for some reason.
     */
    if (isNetworkAuthError || isGraphQLAuthError) {
      logout()
        .then(() => toast.info(`Your session has expired!`)) // TODO: Translate?
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

  __apolloClient__ = apolloClient;

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
