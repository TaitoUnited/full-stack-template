import React from 'react';
import { Typography } from '@material-ui/core';
import ErrorBoundary from '~infra/ErrorBoundary';

const Layouts = () => (
  <ErrorBoundary>
    <Typography variant='title'>Layouts</Typography>
    <Typography>
      Provides some reusable example layouts and animations
    </Typography>
  </ErrorBoundary>
);

export default Layouts;
