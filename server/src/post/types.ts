import { Joi } from "koa-joi-router";
import { IDbItem, ItemSchema } from "../common/types";

export interface IDbPost extends IDbItem {
  subject: string;
  content: string;
  author: string;
}

export const BasePostSchema = Joi.object({
  subject: Joi.string().required(),
  content: Joi.string().required(),
  author: Joi.string().required()
});

export const PostSchema = ItemSchema.concat(BasePostSchema);
