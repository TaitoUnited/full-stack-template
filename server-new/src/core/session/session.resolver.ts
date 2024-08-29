import { builder } from '~/setup/graphql/builder';
import { User } from '../user/user.resolver';
import * as userService from '../user/user.service';
import * as sessionService from './session.service';
import { GraphQLError } from '~/common/error';

export function setupResolvers() {
  builder.queryField('me', (t) =>
    t.field({
      type: User,
      nullable: true,
      resolve: async (_, __, ctx) => {
        if (!ctx.user) return null;
        return userService.getUser(ctx.db, ctx.user.id);
      },
    })
  );

  builder.mutationField('login', (t) =>
    t.field({
      type: 'String',
      args: { email: t.arg.string(), password: t.arg.string() },
      resolve: async (_, args, ctx) => {
        /**
         * Simulate a delay to prevent timing attacks where attackers can determine
         * if an email exists in the system based on the response time.
         */
        const [loginResult] = await Promise.all([
          sessionService.login(ctx.db, {
            auth: ctx.auth,
            email: args.email,
            password: args.password,
          }),
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ]);

        if ('error' in loginResult) {
          if (loginResult.status === 401) {
            throw GraphQLError.unauthorized(loginResult.error);
          } else if (loginResult.status === 400) {
            throw GraphQLError.userInput(loginResult.error);
          } else {
            throw GraphQLError.internal();
          }
        }

        const { cookie } = loginResult;

        ctx.reply.setCookie(cookie.name, cookie.value, cookie.attributes);

        return 'OK';
      },
    })
  );

  builder.mutationField('logout', (t) =>
    t.field({
      type: 'String',
      resolve: async (_, __, ctx) => {
        if (!ctx.session) return 'OK';
        const cookie = await sessionService.logout(ctx.auth, ctx.session.id);
        ctx.reply.clearCookie(cookie.name, cookie.attributes);
        return 'OK';
      },
    })
  );
}
