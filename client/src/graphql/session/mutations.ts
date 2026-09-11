import { graphql } from '~/graphql/gql';

export const LoginMutation = graphql(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      status
    }
  }
`);

export const LogoutMutation = graphql(`
  mutation Logout {
    logout {
      status
    }
  }
`);
