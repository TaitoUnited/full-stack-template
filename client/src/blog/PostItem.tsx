import React from 'react';
import styled from 'styled-components';

import { Post } from '~shared/types/blog';

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
  margin: ${props => props.theme.spacing(1)}px 0
    ${props => props.theme.spacing(1)}px 0;
`;

export default PostItem;
