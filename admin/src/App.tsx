import React from 'react';
import { Admin, Resource } from 'react-admin';
import commonEn from 'ra-language-english';
import { createBrowserHistory } from 'history';

import createRestClient from './common/api/restClient.api';
import authProvider from './common/api/authProvider.api';
import common, { commonSagas } from './common/common.ducks';
import { PostIcon, PostList, PostCreate, PostShow, PostEdit } from './blog';
import commonFi from './common/messages/fi.messages';
import postsEn from './blog/en.messages';
import postsFi from './blog/fi.messages';

const messages = {
  en: {
    ...commonEn,
    ...postsEn,
    resources: {
      ...postsEn.resources,
    },
  },
  fi: {
    ...commonFi,
    ...postsFi,
    resources: {
      ...postsFi.resources,
    },
  },
};

const API_URL = process.env.API_URL as string;
const restClient = createRestClient(API_URL);
const history = createBrowserHistory({ basename: 'admin' });
const i18nProvider = (locale: 'fi' | 'en') => messages[locale];

const App = () => (
  <Admin
    title="Admin GUI"
    dataProvider={restClient}
    // The template has basic auth
    // authProvider={authProvider}
    locale="fi"
    i18nProvider={i18nProvider}
    history={history}
    customReducers={{ common }}
    customSagas={[commonSagas]}
  >
    <Resource
      name="posts"
      list={PostList}
      create={PostCreate}
      edit={PostEdit}
      show={PostShow}
      icon={PostIcon}
    />
  </Admin>
);

export default App;
