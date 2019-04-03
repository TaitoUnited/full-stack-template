import React from 'react';
import { Typography } from '@material-ui/core';

import { Page, withErrorBoundary } from '~ui';

const Orders = () => (
  <Page>
    <Typography variant="title">Orders</Typography>
    <Typography>Something something something</Typography>
  </Page>
);

export default withErrorBoundary(Orders) as any;
