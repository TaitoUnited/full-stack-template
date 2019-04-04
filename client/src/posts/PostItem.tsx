import React from 'react';

import styled from '~styled';
import { Post } from './post.types';

interface Props {
  post: Post;
}

const PostItem = ({ post }: Props) => (
  <Wrapper>
    <div>
      Subject:
      {post.subject}
    </div>
    <div>
      Author:
      {post.author}
    </div>
    <div>{post.content}</div>
  </Wrapper>
);

const Wrapper = styled.div`
  margin: ${props => props.theme.spacing.unit}px 0
    ${props => props.theme.spacing.unit}px 0;
`;

export default PostItem;