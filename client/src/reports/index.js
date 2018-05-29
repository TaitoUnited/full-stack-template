import React from 'react';
import { Typography } from '@material-ui/core';
import ErrorBoundary from '~infra/ErrorBoundary';

const Files = () => (
  <ErrorBoundary>
    <Typography variant='title'>Reports</Typography>
    <Typography>
      Demonstrates graphs, printing, excel export, cron jobs, background jobs
      and server push.
    </Typography>
  </ErrorBoundary>
);

export default Files;
