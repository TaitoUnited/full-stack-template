import Koa from 'koa';
import { Joi } from 'koa-joi-router';
import { IDatabase, ITask } from 'pg-promise';

// DAOs can work with raw database calls & transactions
export type Db = IDatabase<{}> | ITask<{}>;

export type NonPromise<T> = T extends Promise<any> ? never : T;

export interface DbItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
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
