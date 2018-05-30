import queryString from 'query-string';

const ImageViewPage = ({ user }) => {
  const params = queryString.parse(window.location.search);
  const { hash } = window.location;
  if (params.database && hash && user) {
    window.location.replace('http://www.taitounited.fi/img/logo_vihrea_li.png');
  }

  return null;
};

export default ImageViewPage;
