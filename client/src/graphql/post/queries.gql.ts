import { gql } from '@apollo/client';

export const POST_LIST = gql`
  query PostList {
    posts {
      total
      data {
        id
        subject
        createdAt
      }
    }
  }
`;

export const POST = gql`
  query Post($id: String!) {
    post(id: $id) {
      id
      createdAt
      author
      subject
      content
    }
  }
`;
