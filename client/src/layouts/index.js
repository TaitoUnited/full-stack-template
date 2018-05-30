import React from 'react';
import { Typography } from '@material-ui/core';

import Page from '~layout/Page';

const Layouts = () => (
  <Page>
    <Typography variant='title'>Layouts</Typography>
    <Typography>
      Provides some reusable example layouts and animations. NOTE: Implement
      using the existing `images` and `posts` database tables.
    </Typography>
  </Page>
);

export default Layouts;
