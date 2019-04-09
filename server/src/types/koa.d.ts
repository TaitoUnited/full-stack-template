// Additions by project
import Koa from 'koa';
import { IDatabase, ITask } from 'pg-promise';
import Bunyan from 'bunyan';

declare module 'koa' {
  interface Request {
    body?: any;
    params: { [key: string]: string };
  }

  interface BaseContext {
    db: IDatabase<{}>;
    tx: ITask<{}>;
    log: Bunyan;
  }
}
