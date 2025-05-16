import type { Context } from '~/setup/context';

declare module 'fastify' {
  interface FastifyRequest {
    ctx: Context;
  }

  interface FastifyInstance {
    authenticate(): void;
    ensureSession(): void;
  }
}
