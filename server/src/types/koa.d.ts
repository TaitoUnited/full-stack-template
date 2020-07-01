// Additions by project
import { IDatabase, ITask } from 'pg-promise';
import { State } from '../common/types';

declare module 'koa' {
  interface Request {
    body?: any;
    params: { [key: string]: string };
  }

  interface Context {
    state: State;
  }
}
