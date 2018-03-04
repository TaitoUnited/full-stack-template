/**
 * Helper to dynamically load components with react-loadable lib.
 */

import React from 'react';
import styled from 'styled-components';
import Loadable from 'react-loadable';

// TODO: use appropriate loading component
const Loading = styled.div`
  width: 100%;
  margin-top: 60px;
  text-align: center;
`;

export default function LazyLoadHandler(opts) {
  return Loadable({
    delay: 200, // show loading after 200ms => no flickering if comp loads fast
    loading: () => <Loading>Ladataan...</Loading>,
    ...opts
  });
}
