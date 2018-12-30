import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';

const propTypes = {
  post: PropTypes.any.isRequired,
  onChangePost: PropTypes.func.isRequired,
  onCreatePost: PropTypes.func.isRequired
};

const PostForm = ({ post, onChangePost, onCreatePost }) => {
  return (
    <StyledForm data-test='post-form' noValidate autoComplete='off'>
      <Row>
        <StyledTextField
          data-test='subject-field'
          label='Subject'
          value={post.subject}
          onChange={e => onChangePost({ subject: e.target.value })}
          margin='normal'
        />
        <StyledTextField
          data-test='author-field'
          label='Author'
          value={post.author}
          onChange={e => onChangePost({ author: e.target.value })}
          margin='normal'
        />
      </Row>
      <Row>
        <StyledTextField
          data-test='content-field'
          label='Content'
          value={post.content}
          onChange={e => onChangePost({ content: e.target.value })}
          margin='normal'
          multiline
        />
      </Row>
      <Row>
        <StyledButton
          data-test='add-post'
          variant='outlined'
          color='primary'
          onClick={onCreatePost}
        >
          Add
        </StyledButton>
      </Row>
    </StyledForm>
  );
};

const StyledForm = withTheme()(styled.form`
  && {
    max-width: 700px;
    margin-bottom: ${props => props.theme.spacing.unit * 4}px;
  }
`);

const Row = withTheme()(styled.div`
  && {
    display: flex;
    flex-wrap: wrap;
  }
`);

const StyledTextField = withTheme()(styled(TextField)`
  && {
    margin-right: ${props => props.theme.spacing.unit * 2}px;
    flex: 1;
    @media (max-width: 420px) {
      width: 100%;
      flex: none;
      margin-right: 0;
    }
  }
`);

const StyledButton = withTheme()(styled(Button)`
  && {
    margin: ${props => props.theme.spacing.unit}px;
    margin-left: 0;
    margin-top: ${props => props.theme.spacing.unit * 3}px;
  }
`);

PostForm.propTypes = propTypes;

export default PostForm;
