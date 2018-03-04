import React from 'react';
import styled from 'styled-components';

import ErrorBoundary from '~infra/errorBoundary.component.js';

const ViewWrapper = styled.div`
  padding: 24px;
`;

const View = ({ type, children }) => (
  <ViewWrapper className={`View View-${type}`}>
    <ErrorBoundary>{children}</ErrorBoundary>
  </ViewWrapper>
);

export default View;
