import { graphql } from '~/graphql/gql';

export const CreatePostMutation = graphql(`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
    }
  }
`);
