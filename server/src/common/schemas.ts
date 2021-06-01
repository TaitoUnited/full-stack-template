import { Joi } from 'koa-joi-router';

/**
 * REST API common schema definitions
 */

export const ItemSchema = Joi.object().keys({
  id: Joi.string().guid().required(),
  createdAt: Joi.date().iso().required(),
  updatedAt: Joi.date().iso().required(),
});
