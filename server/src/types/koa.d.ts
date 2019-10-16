// Additions by project
import { IDatabase, ITask } from 'pg-promise';
import Bunyan from 'bunyan';
import { User } from '../../shared/types/common';

declare module 'koa' {
  interface Request {
    body?: any;
    params: { [key: string]: string };
  }

  interface Context {
    state: {
      db: IDatabase<{}>;
      tx: ITask<{}>;
      log: Bunyan;
      storage: AWS.S3;
      user?: User;
    };
  }
}
