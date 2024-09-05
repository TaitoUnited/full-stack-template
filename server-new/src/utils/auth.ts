import { Lucia, TimeSpan } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';

import { config } from './config';
import { getDb } from '~/db';
import { sessionTable } from '~/domain/session/session.db';
import { userTable } from '~/domain/user/user.db';

let lucia: Lucia | null = null;

export async function getAuth() {
  if (lucia) return lucia;

  const db = await getDb();
  const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

  /**
   * See configuration options here:
   * https://lucia-auth.com/basics/configuration
   */
  lucia = new Lucia(adapter, {
    // Note that session expirations are automatically extended for active users
    sessionExpiresIn: new TimeSpan(2, 'w'), // 2 weeks
    sessionCookie: {
      name: config.SESSION_COOKIE,
      attributes: {
        secure: config.COMMON_ENV !== 'local',
        domain: config.COMMON_DOMAIN,
        path: '/',
      },
    },
    // Only expose the user ID in the session
    getUserAttributes: (attributes) => ({
      id: attributes.id,
    }),
    // Include the currently selected organisation ID in the session
    getSessionAttributes: (attributes) => ({
      organisationId: attributes.organisationId,
    }),
  });

  return lucia;
}
