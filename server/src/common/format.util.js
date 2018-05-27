import _ from 'lodash';

const camel = obj => {
  return obj ? _.mapKeys(obj, (value, key) => _.camelCase(key)) : obj;
};

export const asCamelCase = obj => {
  return obj && Array.isArray(obj)
    ? obj.map(element => camel(element))
    : camel(obj);
};

export default {
  asCamelCase,
};
