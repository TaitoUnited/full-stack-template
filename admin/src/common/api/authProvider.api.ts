import {
  AUTH_GET_PERMISSIONS,
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_ERROR,
  AUTH_CHECK,
} from 'react-admin';

/* eslint-disable prefer-promise-reject-errors */

const authProvider = (type: string, params: any) => {
  if (type === AUTH_LOGIN) {
    const { username, password } = params;
    const request = new Request(`${process.env.API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(({ data }) => {
        console.debug('[data]', data);
        localStorage.setItem('token', data.token);
      });
  }

  if (type === AUTH_LOGOUT) {
    localStorage.removeItem('token');
    return Promise.resolve();
  }

  if (type === AUTH_ERROR) {
    const { status } = params;
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      return Promise.reject({ redirectTo: '/login' });
    }
    return Promise.resolve();
  }

  if (type === AUTH_CHECK) {
    return localStorage.getItem('token')
      ? Promise.resolve()
      : Promise.reject({ redirectTo: '/login' });
  }

  if (type === AUTH_GET_PERMISSIONS) {
    // TODO
    return Promise.resolve('-');
  }

  return Promise.reject('Unkown method');
};

export default authProvider;
