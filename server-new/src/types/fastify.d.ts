import type Bunyan from 'bunyan';

import type { DrizzleDb } from '../db/index';

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
    user: any; // TODO
    ctx: {
      db: DrizzleDb;
      log: Bunyan;
      requestId: string;
    };
  }

  interface FastifyInstance {
    jwtVerify(): Promise<void>;
    authenticate(): void;
    requireLisence(): void;
    requireAdmin(): void;
  }
}
