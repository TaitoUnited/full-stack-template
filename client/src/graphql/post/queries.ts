import { graphql } from '~graphql';

export const PostListQuery = graphql(`
  query PostList {
    posts {
      id
      title
      createdAt
    }
  }
`);

export const PostQuery = graphql(`
  query Post($id: String!) {
    post(id: $id) {
      id
      title
      content
      createdAt
      author {
        id
        name
      }
    }
  }
`);
