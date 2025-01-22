import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
  type NormalizedCacheObject,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { toast } from 'react-hot-toast';

import { config } from '~/constants/config';
import { logout } from '~/services/auth';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '~/services/i18n';
import { workspaceIdStore } from '~/stores/workspace-id-store';
import { storage } from '~/utils/storage';

let __apolloClient__: ApolloClient<NormalizedCacheObject>;

export function getApolloClient() {
  return __apolloClient__;
}

export function setupApolloClient() {
  const cache = new InMemoryCache();

  const httpLink = new HttpLink({ uri: `${config.API_URL}/graphql` });

  const headersLink = new ApolloLink((operation, forward) => {
    const locales = SUPPORTED_LOCALES;
    const locale = storage.get('locale');

    operation.setContext((context: any) => {
      const headers = {
        ...context.headers,
        'Accept-Language': locales.includes(locale) ? locale : DEFAULT_LOCALE,
        'x-organisation-id': workspaceIdStore.getState().workspaceId,
      };

      return { headers };
    });

    return forward(operation);
  });

  const requestLinks = from([headersLink, httpLink]);

  // https://www.apollographql.com/docs/react/networking/advanced-http-networking#customizing-response-logic
  const logoutLink = onError(({ graphQLErrors, networkError }) => {
    const isNetworkAuthError =
      networkError &&
      'statusCode' in networkError &&
      networkError.statusCode === 401;

    const isGraphQLAuthError =
      graphQLErrors &&
      graphQLErrors.some(error => error.extensions?.code === 'UNAUTHORIZED');

    /**
     * Automatically log out the user if the session has expired and session
     * refreshing has failed on the server for some reason.
     */
    if (isNetworkAuthError || isGraphQLAuthError) {
      logout()
        .then(() => toast(`Your session has expired!`)) // TODO: Translate?
        .catch(e => console.log('Failed to logout', e)); // this should never happen...
    }
  });

  const apolloClient = new ApolloClient({
    link: logoutLink.concat(requestLinks),
    cache,
    connectToDevTools: process.env.NODE_ENV === 'development',
    devtools: {
      enabled: process.env.NODE_ENV === 'development',
    },
  });

  __apolloClient__ = apolloClient;

  return apolloClient;
}
