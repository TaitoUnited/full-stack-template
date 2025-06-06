import { builder } from '~/setup/graphql/builder';
import { userController } from './user.controller';

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
        return userController.getOrgUser(ctx, args.id);
      },
    })
  );

  builder.queryField('users', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: [User],
      args: { search: t.arg.string({ required: false }) },
      resolve: async (_, __, ctx) => {
        return userController.getOrgUsers(ctx);
      },
    })
  );
}
