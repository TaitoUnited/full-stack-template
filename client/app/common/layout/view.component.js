import React from 'react';
import styled from 'styled-components';
import { Layout } from 'react-components-kit';

import ErrorBoundary from '~infra/errorBoundary.component.js';

const ViewWrapper = styled(Layout)``;

const View = ({ type, children }) => (
  <ViewWrapper className={`View View-${type}`}>
    {/* <Layout.Box flex={1}>
      <Heading>{title}</Heading>
    </Layout.Box>
    <Layout.Box>
      <Heading>{title}</Heading>
    </Layout.Box> */}
    <ErrorBoundary>{children}</ErrorBoundary>
  </ViewWrapper>
);

export default View;
