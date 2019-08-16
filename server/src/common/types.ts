import Koa from 'koa';
import { Joi } from 'koa-joi-router';
import { IDatabase, ITask } from 'pg-promise';
import { User } from '../../shared/types/common';

// DAOs can work with raw database calls & transactions
export type Db = IDatabase<{}> | ITask<{}>;

export type NonPromise<T> = T extends Promise<any> ? never : T;

export interface State {
  log: any; // TODO: typing
  db: Db;
  tx: Db;
  storage: any; // TODO: typing
  user?: User;
}

export const ItemSchema = Joi.object().keys({
  id: Joi.string()
    .guid()
    .required(),
  createdAt: Joi.date()
    .iso()
    .required(),
  updatedAt: Joi.date()
    .iso()
    .required(),
});
