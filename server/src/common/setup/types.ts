import { IDatabase, ITask } from 'pg-promise';
import Bunyan from 'bunyan';

export enum UserRole {
  ADMIN = 'admin',
  GUEST = 'guest',
}

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  language?: string;
  role: UserRole;
}

// DAOs can work with raw database calls & transactions
export type Db =
  | IDatabase<Record<string, unknown>>
  | ITask<Record<string, unknown>>;

export type NonPromise<T> = T extends Promise<any> ? never : T;

export interface State {
  db: IDatabase<Record<string, unknown>>;
  tx: ITask<Record<string, unknown>>;
  log: Bunyan;
  user?: User;
}
