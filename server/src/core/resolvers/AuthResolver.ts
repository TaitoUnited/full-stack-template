import { Service } from 'typedi';
import { Context } from 'koa';
import { AuthenticationError, UserInputError } from 'apollo-server-koa';
import { Ctx, Arg, Resolver, Mutation } from 'type-graphql';

import {
  LoginUserInput,
  LoginUserResult,
  User,
  UserFilter,
  RegisterUserInput,
  RegisterUserResult,
} from '../types/user';

import { Authorize } from '../../common/utils/auth';
import { addFilter } from '../../common/utils/validate';
import { checkLogin, refreshTokens } from '../../common/utils/session';
import { Order, OrderDirection } from '../../common/types/search';
import { UserService } from '../services/UserService';

@Service()
@Resolver(() => User)
export default class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => RegisterUserResult)
  async register(
    @Ctx() ctx: Context,
    @Arg('input') input: RegisterUserInput
  ): Promise<RegisterUserResult> {
    const user = await this.userService.create(ctx.state, input);
    const res = await checkLogin(user, input.password, 'user');

    if (res.kind === 'fail') {
      throw new UserInputError('wrong password');
    }

    return {
      user,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    };
  }

  @Mutation(() => LoginUserResult)
  async login(
    @Ctx() ctx: Context,
    @Arg('input') input: LoginUserInput
  ): Promise<LoginUserResult> {
    const filterGroups = addFilter<UserFilter>({
      field: 'email',
      value: input.email,
    });

    const users = await this.userService.search({
      state: ctx.state,
      filterGroups,
      order: new Order('email', OrderDirection.ASC),
    });

    if (users.data.length !== 1) {
      throw new AuthenticationError('no user found');
    }

    const [user] = users.data;
    const res = await checkLogin(user, input.password, 'user');

    if (res.kind === 'fail') {
      throw new AuthenticationError('wrong password');
    }

    return {
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    };
  }

  @Mutation(() => LoginUserResult)
  @Authorize('user')
  async refreshTokens(
    @Arg('refreshToken', () => String) refreshToken: string
  ): Promise<LoginUserResult> {
    const res = await refreshTokens(refreshToken);

    return {
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    };
  }
}
