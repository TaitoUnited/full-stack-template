import './index.css';

import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';

import App from './App';
import { setupErrorReporting } from '~services/reporting';
import { setupApolloClient } from '~graphql';

async function init() {
  setupErrorReporting();

  const apolloClient = await setupApolloClient();

  // TODO: consider adding StrictMode
  // It's important to note that it will cause double effects in dev mode!
  ReactDOM.createRoot(document.getElementById('app')!).render(
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  );
}

init();
