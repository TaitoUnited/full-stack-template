import { checkOrganisationMembership } from '~/src/utils/authorisation';
import { chatService } from './chat.service';
import { AuthenticatedContext } from '~/setup/context';

async function getChatMessages(ctx: AuthenticatedContext, userId: string) {
  checkOrganisationMembership(ctx);

  return await chatService.getChatMessages(ctx.db, userId);
}

export const chatController = {
  getChatMessages,
};
