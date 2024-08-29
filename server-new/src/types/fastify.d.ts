import type Bunyan from 'bunyan';
import type { Lucia, Session, User } from 'lucia';

import type { DrizzleDb } from '../db/index';

declare module 'fastify' {
  interface FastifyRequest {
    ctx: {
      db: DrizzleDb;
      auth: Lucia;
      log: Bunyan;
      user: null | User;
      session: null | Session;
      requestId: string;
    };
  }

  interface FastifyInstance {
    authenticate(): void;
  }
}
