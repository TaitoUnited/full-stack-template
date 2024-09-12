import { eq } from 'drizzle-orm';

import { type DrizzleDb } from '../index';
import { type UserSeed } from './user.seed';
import { chatMessageTable, chatTable } from '~/domain/example/chat/chat.db';

export async function seed(db: DrizzleDb, data: { users: UserSeed }) {
  console.log('Inserting chats per user...');

  const users = Object.values(data.users);

  for (const user of users) {
    await db
      .insert(chatTable)
      .values({ userId: user.id })
      .onConflictDoNothing();

    const [chat] = await db
      .select()
      .from(chatTable)
      .where(eq(chatTable.userId, user.id));

    if (!chat) continue;

    const messages = await db
      .select()
      .from(chatMessageTable)
      .where(eq(chatMessageTable.chatId, chat.id));

    // Insert a message from the AI if we don't have any messages
    if (messages.length === 0) {
      await db
        .insert(chatMessageTable)
        .values({ chatId: chat.id, authorType: 'ai', content: 'Hello!' })
        .onConflictDoNothing();
    }
  }
}
