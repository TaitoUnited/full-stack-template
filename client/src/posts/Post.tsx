import React from 'react';
import styled from '~styled';
import { withTheme } from '@material-ui/core/styles';

interface Props {
  post: {
    subject: string;
    author: string;
    content: string;
  };
}

const Post = ({ post }: Props) => (
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

const Wrapper = withTheme()(styled.div`
  margin: ${props => props.theme.spacing.unit}px 0
    ${props => props.theme.spacing.unit}px 0;
`);

export default Post;
