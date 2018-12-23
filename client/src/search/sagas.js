import filesApi from '~entities/files.api';
import postsApi from '~entities/posts.api';
import { searchSagas, searchSagasInit } from './common/sagas';

const sectionsByPath = {
  '/search/images': 'images',
  '/search/posts': 'posts'
};

const errorHandler = err => {
  if (err.statusCode === 403) window.location.reload();
  if (err.response && err.response.status === 403) window.location.reload();
};

searchSagasInit(
  // sectionsByPath
  sectionsByPath,
  // apisBySection
  {
    images: filesApi,
    posts: postsApi
  },
  // criteriaTypeByName
  {
    authors: 'array',
    sources: 'array'
  },
  errorHandler
);

export default searchSagas;
