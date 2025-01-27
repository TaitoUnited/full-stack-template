import { graphql } from '~/graphql';

export const OrganisationsQuery = graphql(`
  query Organisations {
    organisations {
      id
    }
  }
`);
