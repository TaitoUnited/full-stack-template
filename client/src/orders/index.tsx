import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Trans } from '@lingui/macro';

import { Page } from '~ui';

const Orders = () => (
  <Page>
    <Typography variant="h6">
      <Trans>Orders</Trans>
    </Typography>
    <Typography>Something something something</Typography>
  </Page>
);

export default Orders;
