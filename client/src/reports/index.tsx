import React from 'react';
import { Typography } from '@material-ui/core';
import { Trans } from '@lingui/macro';

import { Page } from '~ui';

const Reports = () => (
  <Page>
    <Typography variant="title">
      <Trans>Reports</Trans>
    </Typography>
    <Typography>
      Demonstrates graphs, printing, excel export and cron jobs. NOTE: Implement
      using the existing `files` and `posts` database tables.
    </Typography>
  </Page>
);

export default Reports;
