import { config } from '~/utils/config';
import { builder } from '~/setup/graphql/builder';
import { GraphQLError } from '~/utils/error';
import { User } from '../user/user.resolver';
import * as userService from '../user/user.service';
import * as sessionService from './session.service';

export function setupResolvers() {
  builder.queryField('me', (t) =>
    t.withAuth({ session: true }).field({
      type: User,
      nullable: true,
      resolve: async (_, __, ctx) => {
        return userService.getUser(ctx.db, ctx.user.id);
      },
    })
  );

  // Cookie-based authentication for web apps

  builder.mutationField('login', (t) =>
    t.field({
      type: builder.simpleObject('LoginResponse', {
        fields: (t) => ({
          status: t.string(),
        }),
      }),
      args: {
        email: t.arg.string(),
        password: t.arg.string(),
      },
      resolve: async (_, args, ctx) => {
        const { cookie } = await wrapLogin(
          sessionService.login(ctx.db, { auth: ctx.auth, ...args })
        );

        ctx.reply.setCookie(cookie.name, cookie.value, cookie.attributes);

        return { status: 'OK' };
      },
    })
  );

  builder.mutationField('logout', (t) =>
    t.field({
      type: builder.simpleObject('LogoutResponse', {
        fields: (t) => ({
          status: t.string(),
        }),
      }),
      resolve: async (_, __, ctx) => {
        if (!ctx.session) {
          return { status: 'OK' };
        }

        await ctx.auth.invalidateSession(ctx.session.id);
        const cookie = ctx.auth.createBlankSessionCookie();

        ctx.reply.clearCookie(cookie.name, cookie.attributes);

        return { status: 'OK' };
      },
    })
  );

  // Token-based authentication for mobile apps etc that can't use cookies

  builder.mutationField('loginToken', (t) =>
    t.field({
      type: builder.simpleObject('LoginTokenResponse', {
        fields: (t) => ({
          sessionId: t.string(),
        }),
      }),
      args: {
        email: t.arg.string(),
        password: t.arg.string(),
      },
      resolve: async (_, args, ctx) => {
        const { sessionId } = await wrapLogin(
          sessionService.tokenLogin(ctx.db, { auth: ctx.auth, ...args })
        );

        return { sessionId };
      },
    })
  );

  builder.mutationField('logoutToken', (t) =>
    t.field({
      type: builder.simpleObject('LogoutTokenResponse', {
        fields: (t) => ({
          status: t.string(),
        }),
      }),
      resolve: async (_, __, ctx) => {
        if (!ctx.session) {
          return { status: 'OK' };
        }

        await ctx.auth.invalidateSession(ctx.session.id);

        return { status: 'OK' };
      },
    })
  );
}

// Helpers

/**
 * Wrapper function that races the login promise with a delay to prevent timing
 * attacks and maps internal login errors to GraphQL errors.
 */
async function wrapLogin<T>(loginPromise: Promise<T>) {
  /**
   * Simulate a delay to prevent timing attacks where attackers can determine
   * if an email exists in the system based on the response time.
   * Note that this is only needed in prod environment and we don't want to
   * slow down API integration tests for non-prod environments.
   */
  const [result] = await Promise.allSettled([
    loginPromise,
    new Promise((resolve) =>
      setTimeout(resolve, config.COMMON_ENV === 'prod' ? 2000 : 10)
    ),
  ]);

  if (result.status === 'rejected') {
    if (
      result.reason instanceof sessionService.LoginError &&
      result.reason.name === 'LoginError'
    ) {
      const { status, message } = result.reason;

      // Map internal login error to GraphQL error
      if (status === 401) {
        throw GraphQLError.unauthorized(message);
      } else if (status === 400) {
        throw GraphQLError.badRequest(message);
      } else {
        throw GraphQLError.internal();
      }
    } else {
      // Throw 500 for unexpected errors
      throw GraphQLError.internal();
    }
  }

  return result.value;
}
