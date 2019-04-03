import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import TopBar from './navigation/TopBar';
import SideBar from './navigation/SideBar';
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
