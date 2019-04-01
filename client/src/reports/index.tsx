import React from 'react';
import { Typography } from '@material-ui/core';

import { Page, withErrorBoundary } from '~ui';

const Files = () => (
  <Page>
    <Typography variant="title">Reports</Typography>
    <Typography>
      Demonstrates graphs, printing, excel export and cron jobs. NOTE: Implement
      using the existing `files` and `posts` database tables.
    </Typography>
  </Page>
);

export default withErrorBoundary(Files) as any;
