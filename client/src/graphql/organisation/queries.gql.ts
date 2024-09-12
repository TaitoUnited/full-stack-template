import { gql } from '@apollo/client';

export const ORGANISATIONS = gql`
  query Organisations {
    organisations {
      id
    }
  }
`;
