import React from 'react';
import styled from 'styled-components';
import { Layout, Heading } from 'react-components-kit';

import ErrorBoundary from '~infra/errorBoundary.component.js';

const ViewWrapper = styled(Layout)`
`;

const View = ({ title, type, children }) => (
  <ViewWrapper className={`View View-${type}`} column>
    <Heading>{title}</Heading>
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  </ViewWrapper>
);

export default View;
