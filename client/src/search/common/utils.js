import _ from 'lodash';
import queryString from 'query-string';
import { getBaseHref } from '~infra/browser.utils';

export const excludeParams = {
  pageSize: true
};

export const addSearchStateToPath = (
  path,
  criteria,
  paging,
  itemId, // Optional
  keepBase = false
) => {
  // Get data from store to be used as url params
  let params = {
    ...criteria,
    ...paging
  };

  // Format parameters to a user friendly format
  // TODO avoid lodash, or use a subset only
  params = _.mapValues(params, value => {
    return value;
  });
  params.page += 1;

  // Filter empty and unwanted values from params
  // TODO avoid lodash, or use a subset only
  params = _.pickBy(params, (value, key) => {
    return !excludeParams[key] && value;
  });

  const base = keepBase ? getBaseHref() : '';
  const query = queryString.stringify(params);
  const hash = itemId ? `#${itemId}` : '';
  return `${base}${path}?${query}${hash}`;
};
