import React from 'react';
import { Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import Images from './images';
import Layouts from './layouts';
import Posts from './posts';
import Reports from './reports';
import SearchResults from './search';

const ContentRouter = ({ classes }) => (
  <main className={classes.page}>
    <Route path='/images' component={Images} />
    <Route path='/layouts' component={Layouts} />
    <Route path='/posts' component={Posts} />
    <Route path='/reports' component={Reports} />
    <Route path='/search' component={SearchResults} />
  </main>
);

const styles = {
  page: {
    padding: '24px'
  }
};

export default withStyles(styles)(ContentRouter);
