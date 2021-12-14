import { Context } from 'koa';
import Container, { Service } from 'typedi';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import {
  Pagination,
  FilterGroup,
  Order,
  OrderDirection,
} from '../../common/types/search';
import { EntityId } from '../types/core';
import {
  User,
  UserFilter,
  PaginatedUsers,
  CreateUserInput,
  UpdateUserInput,
  DeleteUserInput,
} from '../types/user';
import { UserService } from '../services/UserService';

/**
 * GraphQL resolver for Users
 */
@Service()
@Resolver(() => User)
class UserResolver {
  constructor(private readonly userService = Container.get(UserService)) {}

  @Authorized()
  @Query(() => PaginatedUsers, { description: 'Search users.' })
  async users(
    @Ctx() ctx: Context,
    @Arg('search', () => String, {
      defaultValue: null,
    })
    search: string,
    @Arg('filterGroups', () => [FilterGroup], {
      defaultValue: [],
    })
    filterGroups: FilterGroup<UserFilter>[],
    @Arg('order', () => Order, {
      defaultValue: new Order(OrderDirection.ASC, 'lastName'),
    })
    order: Order,
    @Arg('pagination', () => Pagination, {
      defaultValue: null,
    })
    pagination: Pagination
  ) {
    return await this.userService.search(
      ctx.state,
      search,
      filterGroups,
      order,
      pagination
    );
  }

  @Authorized()
  @Query(() => User, { description: 'Reads a user.', nullable: true })
  async user(@Ctx() ctx: Context, @Arg('id', () => String) id: string) {
    return await this.userService.read(ctx.state, id);
  }

  @Authorized()
  @Mutation(() => User, { description: 'Creates a new user.' })
  async createUser(@Ctx() ctx: Context, @Arg('input') input: CreateUserInput) {
    return await this.userService.create(ctx.state, input);
  }

  @Authorized()
  @Mutation(() => User, { description: 'Updates a user.' })
  async updateUser(@Ctx() ctx: Context, @Arg('input') input: UpdateUserInput) {
    return await this.userService.update(ctx.state, input);
  }

  @Authorized()
  @Mutation(() => EntityId, { description: 'Deletes a user.' })
  async deleteUser(@Ctx() ctx: Context, @Arg('input') input: DeleteUserInput) {
    return await this.userService.delete(ctx.state, input);
  }
}
