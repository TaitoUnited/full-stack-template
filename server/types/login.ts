import { Authenticator } from '~/src/utils/authentication';

export type LoginOptions = {
  email: string;
  password: string;
  auth: Authenticator; // Injected auth service from context
};
