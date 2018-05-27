import React from 'react';
import { Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import Posts from './posts';
import SearchResults from './search';
import Todo from './todo';

const ContentRouter = ({ classes }) => (
  <main className={classes.page}>
    <Route path='/posts' component={Posts} />
    <Route path='/search' component={SearchResults} />
    <Route path='/todo' component={Todo} />
  </main>
);

const styles = {
  page: {
    padding: '24px'
  }
};

export default withStyles(styles)(ContentRouter);
