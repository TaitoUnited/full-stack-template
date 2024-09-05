import { builder } from '~/setup/graphql/builder';
import { User } from '../../user/user.resolver';
import * as userService from '../../user/user.service';
import * as chatService from './chat.service';

const Message = builder.simpleObject('Message', {
  fields: (t) => ({
    id: t.id(),
    content: t.string(),
    authorType: t.string(),
    authorId: t.string({ nullable: true }),
  }),
});

export function setupResolvers() {
  builder.queryField('chat', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: [Message],
      resolve: async (_, __, ctx) => {
        return chatService.getChatMessages(ctx.db, ctx.user.id);
      },
    })
  );

  builder.objectField(Message, 'author', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: User,
      nullable: true,
      resolve: async (parent, _, ctx) => {
        if (!parent.authorId) return null;

        return userService.getUser(ctx.db, {
          id: parent.authorId,
          organisationId: ctx.organisationId,
        });
      },
    })
  );
}
