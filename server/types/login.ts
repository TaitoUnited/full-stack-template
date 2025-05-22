import { Lucia } from 'lucia';

export type LoginOptions = {
  email: string;
  password: string;
  auth: Lucia; // Injected auth service from context
};
