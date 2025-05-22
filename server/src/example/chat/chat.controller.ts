import { checkOrganisationMembership } from '~/src/utils/authorisation';
import { chatDao } from './chat.dao';
import { AuthenticatedContext } from '~/setup/context';

async function getChatMessages(ctx: AuthenticatedContext, userId: string) {
  checkOrganisationMembership(ctx);

  return await chatDao.getChatMessages(ctx.db, userId);
}

export const chatController = {
  getChatMessages,
};
