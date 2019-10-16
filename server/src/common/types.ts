import { IDatabase, ITask } from 'pg-promise';

// DAOs can work with raw database calls & transactions
export type Db = IDatabase<{}> | ITask<{}>;

export type NonPromise<T> = T extends Promise<any> ? never : T;
