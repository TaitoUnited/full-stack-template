/* eslint-disable no-param-reassign */
export const addTokenToOptions = options => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }

  const token = localStorage.getItem('token');
  options.headers.set('Authorization', `Bearer ${token}`);
};
/* eslint-enable no-param-reassign */

export const foobar = {};
