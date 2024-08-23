import { builder } from '~/setup/graphql/builder';
import * as userService from './user.service';

export const User = builder.simpleObject('User', {
  fields: (t) => ({
    id: t.id(),
    firstName: t.string(),
    lastName: t.string(),
  }),
});

export function setupResolvers() {
  builder.queryField('user', (t) =>
    t.field({
      type: User,
      args: {
        id: t.arg.int({ required: true }),
      },
      resolve: async (_, args) => {
        return userService.getUser(args.id);
      },
    })
  );

  builder.queryField('users', (t) =>
    t.field({
      type: [User],
      nullable: false,
      args: {
        search: t.arg.string(),
      },
      resolve: async () => {
        return userService.getUsers();
      },
    })
  );
}
