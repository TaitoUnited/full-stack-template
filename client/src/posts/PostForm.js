import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';

const propTypes = {
  post: PropTypes.any.isRequired,
  onChangePost: PropTypes.func.isRequired,
  onCreatePost: PropTypes.func.isRequired,
  classes: PropTypes.any.isRequired
};

const PostForm = ({
  post, onChangePost, onCreatePost, classes
}) => {
  return (
    <form className={classes.form} noValidate autoComplete='off'>
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
  );
};

const styles = theme => ({
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.unit * 4
  },
  textField: {
    marginRight: theme.spacing.unit * 2,
    width: 200,
    '@media (max-width: 480px)': {
      width: '100%',
      marginRight: 0
    }
  },
  button: {
    margin: theme.spacing.unit,
    marginLeft: 0,
    marginTop: theme.spacing.unit * 3
  }
});

PostForm.propTypes = propTypes;

export default withStyles(styles)(PostForm);
