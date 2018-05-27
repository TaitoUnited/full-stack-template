import React from 'react';
import { Typography } from '@material-ui/core';
import ErrorBoundary from '~infra/ErrorBoundary';

const Todo = () => (
  <ErrorBoundary>
    <Typography variant='title'>TODO</Typography>
    <Typography>
      TODO more examples. See issue&nbsp;
      <a href='https://github.com/TaitoUnited/server-template/issues/13'>#13</a>
    </Typography>
  </ErrorBoundary>
);

export default Todo;
