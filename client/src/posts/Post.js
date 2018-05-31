import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';

const propTypes = {
  post: PropTypes.any.isRequired
};

const Post = ({ post }) => (
  <Wrapper>
    <div>Subject: {post.subject}</div>
    <div>Author: {post.author}</div>
    <div>{post.content}</div>
  </Wrapper>
);

const Wrapper = withTheme()(styled.div`
  margin: ${props => props.theme.spacing.unit}px 0
    ${props => props.theme.spacing.unit}px 0;
`);

Post.propTypes = propTypes;

export default Post;
