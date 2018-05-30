import React from 'react';
import { Typography } from '@material-ui/core';

import Page from '~layout/Page';

const Images = () => (
  <Page>
    <Typography variant='title'>Images</Typography>
    <Typography>
      Demonstrates file upload, download, storage buckets and automatic image
      cropping/conversion using queued background jobs.
    </Typography>
  </Page>
);

export default Images;
