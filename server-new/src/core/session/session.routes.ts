import { Type } from '@sinclair/typebox';

import { type ServerInstance } from '~/setup/server';
import * as sessionService from './session.service';

export async function sessionRoutes(server: ServerInstance) {
  server.route({
    method: 'POST',
    url: '/login',
    schema: {
      body: Type.Object({
        email: Type.String(),
        password: Type.String(),
      }),
      response: {
        200: Type.String(),
        401: Type.String(),
        400: Type.String(),
      },
    },
    handler: async (request, reply) => {
      /**
       * Simulate a delay to prevent timing attacks where attackers can determine
       * if an email exists in the system based on the response time.
       */
      const [loginResult] = await Promise.all([
        sessionService.login(request.ctx.db, {
          auth: request.ctx.auth,
          email: request.body.email,
          password: request.body.password,
        }),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);

      if ('error' in loginResult) {
        reply.code(loginResult.status).send(loginResult.error);
        return;
      }

      const { cookie } = loginResult;

      reply
        .setCookie(cookie.name, cookie.value, cookie.attributes)
        .code(200)
        .send('OK');
    },
  });

  server.route({
    method: 'POST',
    url: '/logout',
    schema: {
      response: {
        200: Type.String(),
      },
    },
    handler: async (request, reply) => {
      if (!request.ctx.session) return 'OK';

      await request.ctx.auth.invalidateSession(request.ctx.session.id);

      const cookie = request.ctx.auth.createBlankSessionCookie();
      reply.clearCookie(cookie.name, cookie.attributes).code(200).send('OK');
    },
  });
}
