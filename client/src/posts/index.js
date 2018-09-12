import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

import Page from '~layout/Page';
import api from '~entities/posts.api';
import PostForm from './PostForm';
import PostList from './PostList';

class PostsContainer extends Component {
  state = {
    post: {
      subject: '',
      author: '',
      content: ''
    },
    posts: []
  };

  componentDidMount() {
    this.fetchPosts();
  }

  onChangePost = newPost => {
    const { post } = this.state;
    this.setState({
      post: { ...post, ...newPost }
    });
  };

  onCreatePost = async () => {
    const { post, posts } = this.state;
    const newPost = await api.create({ post });
    this.setState({
      post: {
        subject: '',
        author: '',
        content: ''
      },
      posts: [newPost, ...posts]
    });
  };

  fetchPosts = async () => {
    const { items } = await api.fetch({
      offset: 0,
      limit: 20
    });
    this.setState({ posts: items });
  };

  render() {
    const { post, posts } = this.state;
    return (
      <Page>
        <Typography variant='title'>Posts</Typography>
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

export default PostsContainer;
