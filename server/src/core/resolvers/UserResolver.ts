import { Service } from 'typedi';
import { Context } from 'koa';
import { AuthenticationError, UserInputError } from 'apollo-server-koa';
import { Ctx, Arg, Query, Resolver, Mutation, ID } from 'type-graphql';

import { Authorize } from '../../common/utils/auth';

import { User, UpdateUserInput, DeleteUserInput } from '../types/user';
import { UserService } from '../services/UserService';

@Service()
@Resolver(() => User)
export default class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @Authorize('user')
  async currentUser(@Ctx() ctx: Context): Promise<User> {
    const user = await this.userService.read(
      ctx.state,
      ctx.state.user?.id ?? ''
    );

    if (!user) {
      throw new UserInputError('No user found');
    }

    return user;
  }

  @Mutation(() => User)
  @Authorize('user')
  async updateUser(
    @Ctx() ctx: Context,
    @Arg('input') input: UpdateUserInput
  ): Promise<User> {
    const user = await this.userService.read(
      ctx.state,
      ctx.state.user?.id ?? ''
    );

    if (!user) {
      throw new UserInputError('No user found');
    }

    if (user.id !== input.id) {
      throw new AuthenticationError('Not authorized');
    }

    const updatedUser = await this.userService.update(ctx.state, input);

    return updatedUser;
  }

  @Mutation(() => User)
  @Authorize('user')
  async deleteUser(
    @Ctx() ctx: Context,
    @Arg('input', () => ID) input: DeleteUserInput
  ): Promise<User> {
    const user = await this.userService.read(
      ctx.state,
      ctx.state.user?.id ?? ''
    );

    if (!user) {
      throw new UserInputError('No user found');
    }

    if (user.id !== input.id) {
      throw new AuthenticationError('Not authorized');
    }

    return this.userService.delete(ctx, input);
  }
}
