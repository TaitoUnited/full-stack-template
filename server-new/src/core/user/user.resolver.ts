import { builder } from '~/setup/graphql/builder';
import * as userService from './user.service';

export const User = builder.simpleObject('User', {
  fields: (t) => ({
    id: t.string(),
    name: t.string(),
    email: t.string(),
  }),
});

export function setupResolvers() {
  builder.queryField('user', (t) =>
    t.field({
      type: User,
      nullable: true,
      authScopes: { authenticated: true },
      args: { id: t.arg.string() },
      resolve: async (_, args, ctx) => {
        return userService.getUser(ctx.db, args.id);
      },
    })
  );

  builder.queryField('users', (t) =>
    t.field({
      type: [User],
      authScopes: { authenticated: true },
      args: { search: t.arg.string({ required: false }) },
      resolve: async (_, __, ctx) => {
        return userService.getUsers(ctx.db);
      },
    })
  );
}