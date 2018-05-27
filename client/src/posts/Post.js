import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const propTypes = {
  post: PropTypes.any
};

const Post = ({ post, classes }) => (
  <div className={classes.post}>
    <div>Subject: {post.subject}</div>
    <div>Content: {post.content}</div>
  </div>
);

const styles = theme => ({
  post: {
    margin: `${theme.spacing.unit}px 0 ${theme.spacing.unit}px 0`
  }
});

Post.propTypes = propTypes;

export default withStyles(styles)(Post);
