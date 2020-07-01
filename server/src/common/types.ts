import { IDatabase, ITask } from 'pg-promise';

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
