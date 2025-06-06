import { builder } from '~/setup/graphql/builder';
import { User } from '../../user/user.resolver';
import { userController } from '../../user/user.controller';
import { chatController } from './chat.controller';

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
        return chatController.getChatMessages(ctx, ctx.user.id);
      },
    })
  );

  builder.objectField(Message, 'author', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: User,
      nullable: true,
      resolve: async (parent, _, ctx) => {
        return userController.getOrgUser(ctx, parent.authorId);
      },
    })
  );
}
