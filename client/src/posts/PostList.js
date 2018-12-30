import React from 'react';
import PropTypes from 'prop-types';

import Post from './Post';

const propTypes = {
  posts: PropTypes.array.isRequired
};

const PostList = ({ posts }) => {
  const postElements = posts.map(p => <Post key={p.id} post={p} />);
  return <div data-test='posts'>{postElements}</div>;
};

PostList.propTypes = propTypes;

export default PostList;
