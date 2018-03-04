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
import {
  UserIcon,
  UserList,
  UserCreate,
  UserShow,
  UserEdit
} from './users/users.section';

import commonFi from './common/messages/fi.messages';
import postsEn from './posts/en.messages';
import postsFi from './posts/fi.messages';
import usersEn from './users/en.messages';
import usersFi from './users/fi.messages';

// TODO make a deep merge with some library instead?
const messages = {
  en: {
    ...commonEn,
    ...postsEn,
    ...usersEn,
    resources: {
      ...postsEn.resources,
      ...usersEn.resources
    }
  },
  fi: {
    ...commonFi,
    ...postsFi,
    ...usersFi,
    resources: {
      ...postsFi.resources,
      ...usersFi.resources
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
    {permissions => [
      <Resource
        name='posts'
        list={PostList}
        create={PostCreate}
        edit={PostEdit}
        show={PostShow}
        remove={Delete}
        icon={PostIcon}
      />,
      permissions ? (
        <Resource
          name='users'
          list={UserList}
          create={UserCreate}
          edit={UserEdit}
          remove={Delete}
          icon={UserIcon}
          show={UserShow}
        />
      ) : null,
      <Resource name='tags' />
    ]}
  </Admin>
);

export default App;
