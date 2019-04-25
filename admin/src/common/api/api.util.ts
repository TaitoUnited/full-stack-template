export const addTokenToOptions = (options: any) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }

  const token = localStorage.getItem('token');
  options.headers.set('Authorization', `Bearer ${token}`);
};
