import _ from 'lodash';
import { NonPromise } from './types';

const camel = (obj: any): any => {
  return obj ? _.mapKeys(obj, (value, key) => _.camelCase(key)) : obj;
};

type MatchArray<T, O> = T extends any[] ? O[] : O;

// TODO: Does not support deep objects
export const asCamelCase = <T>(
  obj: NonPromise<T>
): NonPromise<MatchArray<T, any>> => {
  return obj && Array.isArray(obj)
    ? obj.map(element => camel(element))
    : camel(obj);
};
