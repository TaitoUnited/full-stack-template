import { Context } from 'koa';
import Container, { Service } from 'typedi';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import {
  Pagination,
  Filter,
  Order,
  OrderDirection,
} from '../../shared/types/common';
import { Post, PaginatedPosts, CreatePostInput } from '../../shared/types/blog';
import { PostService } from './PostService';

/**
 * GraphQL resolver for Posts
 */
@Service()
@Resolver(() => Post)
class PostResolver {
  constructor(private readonly postService = Container.get(PostService)) {}

  @Authorized()
  @Query(() => PaginatedPosts, { description: 'Returns posts.' })
  async posts(
    @Ctx() ctx: Context,
    @Arg('pagination', () => Pagination, {
      defaultValue: new Pagination(0, 50),
    })
    pagination: Pagination,
    @Arg('filters', () => [Filter], {
      defaultValue: [],
    })
    filters: Filter<Post>[],
    @Arg('order', () => Order, {
      defaultValue: new Order(OrderDirection.DESC, 'createdAt'),
    })
    order: Order
  ) {
    return await this.postService.readPosts(
      ctx.state,
      pagination,
      filters,
      order
    );
  }

  @Authorized()
  @Mutation(() => Post, { description: 'Creates a new post.' })
  async createPost(@Ctx() ctx: Context, @Arg('input') input: CreatePostInput) {
    return await this.postService.createPost(ctx.state, input);
  }
}
