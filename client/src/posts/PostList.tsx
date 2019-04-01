import React from 'react';

import Post from './Post';

interface Props {
  posts: any;
}

const PostList = ({ posts }: Props) => {
  const postElements = posts.map(p => <Post key={p.id} post={p} />);
  return <div data-test="posts">{postElements}</div>;
};

export default PostList;
