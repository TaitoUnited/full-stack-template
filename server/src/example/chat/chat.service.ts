import { checkOrganisationMembership } from '~/src/utils/authorisation';
import { chatDao } from './chat.dao';
import type { AuthenticatedContext } from '~/setup/context';

function getChatMessages(ctx: AuthenticatedContext, userId: string) {
  checkOrganisationMembership(ctx);

  return chatDao.getChatMessages(ctx.db, userId);
}

export const chatService = {
  getChatMessages,
};
