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

// TODO: add a proper `post` query to the GraphQL API
// this is abusing the `posts` filtering to get a single post
export const POST = gql`
  query Post($id: String!) {
    posts(filters: { type: EXACT, field: "id", value: $id }) {
      data {
        id
        createdAt
        author
        subject
        content
      }
    }
  }
`;
