import React from 'react';

import PostItem from './PostItem';
import { Post } from '~shared/types/blog';

interface Props {
  posts: Post[];
}

const PostList = ({ posts }: Props) => {
  return (
    <div data-test="posts">
      {posts.map(p => (
        <PostItem key={p.id} post={p} />
      ))}
    </div>
  );
};

export default PostList;
