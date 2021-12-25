import { Context } from 'koa';
import Container, { Service } from 'typedi';
import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
  FieldResolver,
  Root,
} from 'type-graphql';
import { Relation } from '../../common/utils/graphql';
import {
  Pagination,
  FilterGroup,
  Order,
  OrderDirection,
} from '../../common/types/search';
import { EntityId } from '../types/core';
import {
  Post,
  PostFilter,
  PaginatedPosts,
  CreatePostInput,
  UpdatePostInput,
  DeletePostInput,
} from '../types/post';
import { PostService } from '../services/PostService';

import { User } from '../types/user';
import { UserService } from '../services/UserService';

/**
 * GraphQL resolver for Posts
 */
@Service()
@Resolver(() => Post)
class PostResolver {
  constructor(
    private readonly postService = Container.get(PostService),
    private readonly userService = Container.get(UserService)
  ) {}

  @Authorized()
  @Query(() => PaginatedPosts, { description: 'Searches posts.' })
  async posts(
    @Ctx() ctx: Context,
    @Arg('search', () => String, {
      defaultValue: null,
    })
    search: string,
    @Arg('filterGroups', () => [FilterGroup], {
      defaultValue: [],
    })
    filterGroups: FilterGroup<PostFilter>[],
    @Arg('order', () => Order, {
      defaultValue: new Order(OrderDirection.DESC, 'createdAt'),
    })
    order: Order,
    @Arg('pagination', () => Pagination, {
      defaultValue: new Pagination(0, 50),
    })
    pagination: Pagination
  ) {
    return await this.postService.search(
      ctx.state,
      search,
      filterGroups,
      order,
      pagination
    );
  }

  @Authorized()
  @Query(() => Post, { description: 'Reads a post.', nullable: true })
  async post(@Ctx() ctx: Context, @Arg('id', () => String) id: string) {
    return await this.postService.read(ctx.state, id);
  }

  @Authorized()
  @Mutation(() => Post, { description: 'Creates a new post.' })
  async createPost(@Ctx() ctx: Context, @Arg('input') input: CreatePostInput) {
    return await this.postService.create(ctx.state, input);
  }

  @Authorized()
  @Mutation(() => Post, { description: 'Updates a post.' })
  async updatePost(@Ctx() ctx: Context, @Arg('input') input: UpdatePostInput) {
    return await this.postService.update(ctx.state, input);
  }

  @Authorized()
  @Mutation(() => EntityId, { description: 'Deletes a post.' })
  async deletePost(@Ctx() ctx: Context, @Arg('input') input: DeletePostInput) {
    return await this.postService.delete(ctx.state, input);
  }

  // ------------------------------------------------------
  // Field resolvers for other entities
  // ------------------------------------------------------

  @Authorized()
  @FieldResolver(() => User, { nullable: true })
  @Relation<Post>('moderatorId')
  async moderator(@Ctx() ctx: Context, @Root() root: Post) {
    return root.moderatorId
      ? await this.userService.read(ctx.state, root.moderatorId)
      : null;
  }
}
