import React from 'react';
import { Admin, Resource } from 'react-admin';
import commonEn from 'ra-language-english';
import createHistory from 'history/createBrowserHistory';

// MOCK
// import jsonRestClient from 'aor-json-rest-client';
// import addUploadFeature from './common/_mock/addUploadFeature';
// import data from './common/_mock/data';
// import mockauthProvider from './common/_mock/authProvider';

// REAL
import createRestClient from './common/api/restClient.api';
import authProvider from './common/api/authProvider.api';
import common, { commonSagas } from './common/common.ducks';

import {
  PostIcon, PostList, PostCreate, PostShow, PostEdit
} from './posts';

import commonFi from './common/messages/fi.messages';
import postsEn from './posts/en.messages';
import postsFi from './posts/fi.messages';

// TODO make a deep merge with some library instead?
const messages = {
  en: {
    ...commonEn,
    ...postsEn,
    resources: {
      ...postsEn.resources
    }
  },
  fi: {
    ...commonFi,
    ...postsFi,
    resources: {
      ...postsFi.resources
    }
  }
};

// MOCK
// const mockClient = jsonRestClient(data, true);
// const uploadCapableMockClient = addUploadFeature(mockClient);
// const mockRestClient = (type, resource, params) =>
//   new Promise(resolve =>
//     setTimeout(
//       () => resolve(uploadCapableMockClient(type, resource, params)),
//       1000
//     )
//   );

// REAL
const restClient = createRestClient(process.env.API_URL);
const history = createHistory({ basename: 'admin' });

// REAL

const i18nProvider = locale => messages[locale];

const App = () => (
  <Admin
    title='Admin GUI'
    dataProvider={restClient}
    authProvider={authProvider}
    locale='fi'
    i18nProvider={i18nProvider}
    history={history}
    customReducers={{ common }}
    customSagas={[commonSagas]}
  >
    {() => [
      <Resource
        name='posts'
        list={PostList}
        create={PostCreate}
        edit={PostEdit}
        show={PostShow}
        icon={PostIcon}
      />
    ]}
  </Admin>
);

export default App;
