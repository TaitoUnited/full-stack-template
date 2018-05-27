import React, { Component } from 'react';
import ErrorBoundary from '~infra/ErrorBoundary';

import api from './api';
import Posts from './Posts';

class PostsContainer extends Component {
  state = {
    post: {
      subject: '',
      content: ''
    },
    posts: []
  };

  componentDidMount() {
    this.fetchPosts();
  }

  onChangePost = post => {
    this.setState({
      post: { ...this.state.post, ...post }
    });
  };

  onCreatePost = async () => {
    const post = await api.create({ post: this.state.post });
    this.setState({
      post: {
        subject: '',
        content: ''
      },
      posts: [post, ...this.state.posts]
    });
  };

  fetchPosts = async () => {
    const { items } = await api.fetch();
    this.setState({ posts: items });
  };

  render() {
    return (
      <ErrorBoundary>
        <Posts
          onChangePost={this.onChangePost}
          onCreatePost={this.onCreatePost}
          post={this.state.post}
          posts={this.state.posts}
        />
      </ErrorBoundary>
    );
  }
}

export default PostsContainer;
