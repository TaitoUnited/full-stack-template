import React from 'react';
import { Typography } from '@material-ui/core';

import { Page, withErrorBoundary } from '~ui';

const Images = () => (
  <Page>
    <Typography variant="title">Images</Typography>
    <Typography>
      Demonstrates file upload, download, storage buckets and queued background
      jobs.
    </Typography>
  </Page>
);

export default withErrorBoundary(Images) as any;
