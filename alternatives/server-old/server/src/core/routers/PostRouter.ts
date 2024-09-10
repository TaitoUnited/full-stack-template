import { Context } from 'koa';
import { Joi } from 'koa-joi-router';
import { Service } from 'typedi';
import { Pagination, Order, OrderDirection } from '../../common/types/search';
import BaseRouter from '../../common/setup/BaseRouter';
import { ItemSchema } from '../../common/types/rest';
import { PostService } from '../services/PostService';

const BasePostSchema = Joi.object({
  subject: Joi.string().allow(null),
  content: Joi.string().allow(null),
  author: Joi.string().allow(null),
  moderatorId: Joi.string().allow(null),
});

const PostSchema = ItemSchema.concat(BasePostSchema);

/**
 * REST API router for Posts
 */
@Service()
export class PostRouter extends BaseRouter {
  constructor(
    private postService: PostService,
    router: any = null
  ) {
    super(router);
    this.group = 'Posts';
    this.prefix = '/posts';
    this.setupRoutes();
  }

  private setupRoutes() {
    this.route({
      method: 'get',
      path: '/',
      documentation: {
        description: 'Search posts',
      },
      validate: {
        output: {
          '200': {
            body: this.Joi.object({
              total: this.Joi.number().required(),
              data: this.Joi.array().items(PostSchema).required(),
            }),
          },
        },
      },
      handler: async (ctx: Context) => {
        const data = await this.postService.search({
          state: ctx.state,
          // TODO: search, filters, order, pagination
          search: '',
          filterGroups: [],
          order: new Order('createdAt', OrderDirection.DESC),
          pagination: new Pagination(0, 50),
        });

        ctx.response.body = {
          total: data.total,
          data: data.data,
        };
      },
    });

    this.route({
      method: 'post',
      path: '/',
      documentation: {
        description: 'Create a post',
      },
      validate: {
        type: 'json',
        body: this.Joi.object({
          data: BasePostSchema.required(),
        }),
        output: {
          '201': {
            body: this.Joi.object({
              data: PostSchema.required(),
            }),
          },
        },
      },
      handler: async (ctx: Context) => {
        const data = await this.postService.create(
          ctx.state,
          ctx.request.body.data
        );

        ctx.response.status = 201;
        ctx.response.body = {
          data,
        };
      },
    });
  }
}
