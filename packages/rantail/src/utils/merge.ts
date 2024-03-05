import _ from 'lodash';

export const overwriteMerge = <T>(...configs: Array<Partial<T>>): T => {
  return _.merge({}, ...configs) as T;
}

export const combineMerge = <T>(...configs: Array<Partial<T>>): T => {
  return _.merge({}, ...configs) as T;
}