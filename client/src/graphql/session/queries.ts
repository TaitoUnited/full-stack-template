import { graphql } from '~/graphql/gql';

export const MeQuery = graphql(`
  query Me {
    me {
      id
    }
  }
`);
