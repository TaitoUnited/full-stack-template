import { gql } from '@apollo/client';

export const POST_LIST = gql`
  query PostList {
    posts {
      id
      title
      createdAt
    }
  }
`;

export const POST = gql`
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
`;
