import { Joi } from 'koa-joi-router';
import { ItemSchema } from '../common/types';

export const BasePostSchema = Joi.object({
  subject: Joi.string().required(),
  content: Joi.string().required(),
  author: Joi.string().required(),
});

export const PostSchema = ItemSchema.concat(BasePostSchema);
