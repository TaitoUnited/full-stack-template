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
    t.withAuth({ authenticated: true }).field({
      type: User,
      nullable: true,
      args: { id: t.arg.string() },
      resolve: async (_, args, ctx) => {
        return userService.getOrgUser(ctx.db, {
          id: args.id,
          organisationId: ctx.organisationId,
        });
      },
    })
  );

  builder.queryField('users', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: [User],
      args: { search: t.arg.string({ required: false }) },
      resolve: async (_, __, ctx) => {
        return userService.getOrgUsers(ctx.db, {
          organisationId: ctx.organisationId,
        });
      },
    })
  );
}
