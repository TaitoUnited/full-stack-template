import type Bunyan from 'bunyan';
import type { Lucia, Session } from 'lucia';

import type { DrizzleDb } from '../db/index';

declare module 'fastify' {
  interface FastifyRequest {
    ctx: {
      db: DrizzleDb;
      auth: Lucia;
      log: Bunyan;
      user: null | { id: string };
      session: null | Session;
      requestId: string;
      organisationId: null | string;
      availableOrganisations: string[];
    };
  }

  interface FastifyInstance {
    authenticate(): void;
  }
}
