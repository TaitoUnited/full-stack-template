import React from 'react';
import styled from 'styled-components';

// Lazy-load helper
import LoadComponent from '~core-components/load.component';

import RootNavi from './root-navi.component';
// import VanillaContainer from './examples/old/vanilla.container';

/* You can code-split and lazy-load components with `LoadComponent` helper
 * that uses react-loadable underneath.
 *
 * Check out the example below.
 *
 * NOTE: Your editor will probably give you an error message
 * for the import statement, just ignore it - webpack handles these dynamic
 * imports for you.
 *
 * Hopefully editors will catch up soon
 * and start to better understand dynamic imports...
 *
 * NOTE: Code splitting is easiest to use in conjunction with routes to reduce
 * the js bundle size.
 */

/* eslint-disable */
const VanillaContainer = LoadComponent({
  loader: () => import(
    /* webpackChunkName: "vanilla-container" */
    './examples/old/vanilla.container'
  ),
});
/* eslint-enable */

const AppWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow-y: auto;
`;
const Content = styled.div`
  padding: 30px;
  flex: 1;
  height: 100vh;
  overflow-y: auto;
`;

const Root = () => (
  <AppWrapper>
    <RootNavi />
    <Content id='app-content'>
      <VanillaContainer />
    </Content>
  </AppWrapper>
);

export default Root;
