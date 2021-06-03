import { Context } from 'koa';
import Container, { Service } from 'typedi';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Post, CreatePostInput } from '../../shared/types/blog';
import { PostService } from './PostService';

/**
 * GraphQL resolver for Posts
 */
@Service()
@Resolver(() => Post)
class PostResolver {
  constructor(private readonly postService = Container.get(PostService)) {}

  @Authorized()
  @Query(() => [Post], { description: 'Returns posts.' })
  async posts(@Ctx() ctx: Context, @Arg('id', { nullable: true }) id?: string) {
    if (id) {
      const post = await this.postService.getPost(ctx.state, id);
      return post ? [post] : [];
    }
    return await this.postService.getAllPosts(ctx.state);
  }

  @Authorized()
  @Mutation(() => Post, { description: 'Creates a new post.' })
  async createPost(@Ctx() ctx: Context, @Arg('input') input: CreatePostInput) {
    return await this.postService.createPost(ctx.state, input);
  }
}
