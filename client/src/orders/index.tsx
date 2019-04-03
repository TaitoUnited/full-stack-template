import React from 'react';
import { Typography } from '@material-ui/core';
import { Trans } from '@lingui/macro';

import { Page } from '~ui';

const Orders = () => (
  <Page>
    <Typography variant="title">
      <Trans>Orders</Trans>
    </Typography>
    <Typography>Something something something</Typography>
  </Page>
);

export default Orders;