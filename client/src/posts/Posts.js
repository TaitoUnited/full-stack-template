import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Button, TextField } from '@material-ui/core';

import Post from './Post';

const propTypes = {
  post: PropTypes.any.isRequired,
  posts: PropTypes.array.isRequired,
  onChangePost: PropTypes.func.isRequired,
  onCreatePost: PropTypes.func.isRequired
};

const Posts = ({ post, posts, onChangePost, onCreatePost, classes }) => {
  const postElements = posts.map(p => <Post key={p.id} post={p} />);
  return (
    <div>
      <Typography variant='title'>Posts</Typography>
      <Typography>Posts implemented with vanilla React.</Typography>
      <form className={classes.container} noValidate autoComplete='off'>
        <TextField
          id='subject'
          label='Subject'
          className={classes.textField}
          value={post.subject}
          onChange={e => onChangePost({ subject: e.target.value })}
          margin='normal'
        />
        <TextField
          id='content'
          label='Content'
          className={classes.textField}
          value={post.content}
          onChange={e => onChangePost({ content: e.target.value })}
          margin='normal'
        />
        <Button
          variant='outlined'
          color='primary'
          className={classes.button}
          onClick={onCreatePost}
        >
          Add
        </Button>
      </form>
      {postElements}
    </div>
  );
};

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginRight: theme.spacing.unit,
    width: 200
  },
  button: {
    margin: theme.spacing.unit,
    marginTop: '24px'
  }
});

Posts.propTypes = propTypes;

export default withStyles(styles)(Posts);
