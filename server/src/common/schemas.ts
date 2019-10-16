import { Joi } from 'koa-joi-router';

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
