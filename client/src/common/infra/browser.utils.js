import createHistory from 'history/createBrowserHistory';

export const getBaseHref = () => {
  const href = document.getElementsByTagName('base')[0].getAttribute('href');
  return href.substring(0, href.length - 1);
};

export const history = createHistory({ basename: getBaseHref() });
