import React from 'react';
import { Typography } from '@material-ui/core';
import ErrorBoundary from '~infra/ErrorBoundary';

const Files = () => (
  <ErrorBoundary>
    <Typography variant='title'>Images</Typography>
    <Typography>
      Demonstrates file upload, file download, storage buckets and image
      cropping/conversion using background jobs.
    </Typography>
  </ErrorBoundary>
);

export default Files;
