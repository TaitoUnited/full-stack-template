import { eq } from 'drizzle-orm';

import { type DrizzleDb } from '~/db';
import { chatMessageTable, chatTable } from './chat.db';

async function getChatMessages(db: DrizzleDb, userId: string) {
  const [chat] = await db
    .select()
    .from(chatTable)
    .where(eq(chatTable.userId, userId));

  if (!chat) return [];

  const messages = await db
    .select()
    .from(chatMessageTable)
    .where(eq(chatMessageTable.chatId, chat.id));

  return messages;
}

export const chatService = {
  getChatMessages,
};
