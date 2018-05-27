/**
 * Helper to dynamically load components with react-loadable lib.
 */

import React from 'react';
import Loadable from 'react-loadable';

export default function LazyLoadHandler(opts) {
  return Loadable({
    delay: 200, // show loading after 200ms => no flickering if comp loads fast
    loading: () => <div>Loading...</div>,
    ...opts
  });
}
