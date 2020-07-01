// Additions by project
import { IDatabase, ITask } from 'pg-promise';
import Bunyan from 'bunyan';
import { User } from '../../shared/types/common';
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
