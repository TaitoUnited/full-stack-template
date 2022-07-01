import { gql } from '@apollo/client';

export const POST_LIST = gql`
  query PostList($order: Order, $pagination: Pagination) {
    posts(order: $order, pagination: $pagination) {
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
