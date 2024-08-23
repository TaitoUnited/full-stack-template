import { builder } from '~/setup/graphql/builder';
import { User } from '../user/user.resolver';
import * as chatService from './chat.service';

const Message = builder.simpleObject('Message', {
  fields: (t) => ({
    id: t.id(),
    message: t.string(),
    user: t.field({ type: User, nullable: false }),
  }),
});

export function setupResolvers() {
  builder.queryField('chat', (t) =>
    t.field({
      type: [Message],
      nullable: false,
      resolve: async () => {
        return chatService.getMessages();
      },
    })
  );
}
