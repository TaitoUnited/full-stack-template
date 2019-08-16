import { ParameterizedContext } from 'koa';
import { Joi } from 'koa-joi-router';
import BaseRouter from '../common/BaseRouter';
import { ItemSchema } from '../common/types';
import { PostService } from './PostService';

const BasePostSchema = Joi.object({
  subject: Joi.string().required(),
  content: Joi.string().required(),
  author: Joi.string().required(),
});

const PostSchema = ItemSchema.concat(BasePostSchema);

export class PostRouter extends BaseRouter {
  private postService: PostService;

  constructor(injections: any = {}) {
    const { router = null, postService = null } = injections;
    super(router);
    this.postService = postService || new PostService(injections);
    this.group = 'Posts'; // TODO: should this be 'blog'?
    this.prefix = '/posts';
    this.setupRoutes();
  }

  private setupRoutes() {
    this.route({
      method: 'get',
      path: '/',
      documentation: {
        description: 'List all posts',
      },
      validate: {
        output: {
          '200': {
            body: this.Joi.object({
              data: this.Joi.array()
                .items(PostSchema)
                .required(),
            }),
          },
        },
      },
      handler: async (ctx: ParameterizedContext) => {
        const data = await this.postService.getAllPosts(ctx.state);

        ctx.response.body = {
          data,
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
      handler: async (ctx: ParameterizedContext) => {
        const data = await this.postService.createPost(
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
