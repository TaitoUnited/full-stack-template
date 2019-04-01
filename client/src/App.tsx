import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import TopBar from './TopBar';
import SideBar from './SideBar';
import Router from './Router';
import Providers from './Providers';

const App = () => (
  <Providers>
    <>
      <CssBaseline />
      <TopBar />
      <SideBar />
      <Router />
    </>
  </Providers>
);

export default App;
