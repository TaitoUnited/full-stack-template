import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost($subject: String!, $author: String!, $content: String!) {
    createPost(
      input: { subject: $subject, author: $author, content: $content }
    ) {
      id
    }
  }
`;
