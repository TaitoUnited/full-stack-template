import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Trans } from '@lingui/macro';

import * as api from '~services/api';
import { Page } from '~ui';
import PostForm from './PostForm';
import PostList from './PostList';
import { PostDraft, Post } from './post.types';

interface State {
  post: PostDraft;
  posts: Post[];
}

class Posts extends React.Component<{}, State> {
  state = {
    post: {
      subject: '',
      author: '',
      content: '',
    },
    posts: [],
  };

  componentDidMount() {
    this.fetchPosts();
  }

  onChangePost = (newPost: PostDraft) => {
    const { post } = this.state;
    this.setState({
      post: { ...post, ...newPost },
    });
  };

  onCreatePost = async () => {
    const { post, posts } = this.state;
    const newPost = await api.createPost(post);
    this.setState({
      post: {
        subject: '',
        author: '',
        content: '',
      },
      posts: [newPost, ...posts],
    });
  };

  fetchPosts = async () => {
    const { items } = await api.fetchPosts({ offset: 0, limit: 20 });
    this.setState({ posts: items });
  };

  render() {
    const { post, posts } = this.state;
    return (
      <Page>
        <Typography variant="h6">
          <Trans>Posts</Trans>
        </Typography>
        <Typography>
          Demonstrates vanilla React, form validation and real-time updates
          (TODO validation and real-time).
        </Typography>
        <PostForm
          post={post}
          onChangePost={this.onChangePost}
          onCreatePost={this.onCreatePost}
        />
        <PostList posts={posts} />
      </Page>
    );
  }
}

export default Posts;
