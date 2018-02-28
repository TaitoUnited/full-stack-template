// @flow

// gives both flow and eslint error if you change the module name
// --> cannot resolve module (missing from flow-typed/npm)
import _ from 'lodash';

const foo = (bar: string) => {
  _.keys({}); // gives error if you change the object parameter to number
  return bar;
};
foo('str'); // gives error if you change the string parameter to number
