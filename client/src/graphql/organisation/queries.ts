import { graphql } from '~/graphql/gql';

export const OrganisationsQuery = graphql(`
  query Organisations {
    organisations {
      id
    }
  }
`);
