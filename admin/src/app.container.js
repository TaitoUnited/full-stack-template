import React from 'react';
import {
  Admin,
  Resource,
  Delete,
  englishMessages as commonEn
} from 'admin-on-rest';
import createHistory from 'history/createBrowserHistory';

// MOCK
// import jsonRestClient from 'aor-json-rest-client';
// import addUploadFeature from './common/_mock/addUploadFeature';
// import data from './common/_mock/data';
// import mockAuthClient from './common/_mock/authClient';

// REAL
import createRestClient from './common/api/restClient.api';
import authClient from './common/api/authClient.api';
import common, { commonSagas } from './common/common.ducks';

import { PostIcon, PostList, PostCreate, PostShow, PostEdit } from './posts';

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

const App = () => (
  <Admin
    title='Admin GUI'
    restClient={restClient}
    authClient={authClient}
    locale='fi'
    messages={messages}
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
        remove={Delete}
        icon={PostIcon}
      />
    ]}
  </Admin>
);

export default App;
