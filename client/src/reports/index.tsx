import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Trans } from '@lingui/macro';

import { Page } from '~ui';

const Reports = () => (
  <Page>
    <Typography variant="h6">
      <Trans>Reports</Trans>
    </Typography>
    <Typography>
      Demonstrates graphs, printing, excel export and cron jobs. NOTE: Implement
      using the existing `files` and `posts` database tables.
    </Typography>
  </Page>
);

export default Reports;
