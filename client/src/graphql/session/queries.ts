import { graphql } from '~graphql';

export const MeQuery = graphql(`
  query Me {
    me {
      id
    }
  }
`);
