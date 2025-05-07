import { Type } from '@sinclair/typebox';

import { type ServerInstance } from '~/setup/server';
import { ApiRouteError } from '~/src/utils/error';
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
        200: Type.Object({
          status: Type.String(),
        }),
      },
    },
    handler: async (request, reply) => {
      /**
       * Simulate a delay to prevent timing attacks where attackers can determine
       * if an email exists in the system based on the response time.
       */
      const { cookie } = await wrapLogin(
        sessionService.login(request.ctx.db, {
          auth: request.ctx.auth,
          email: request.body.email,
          password: request.body.password,
        })
      );

      reply
        .setCookie(cookie.name, cookie.value, cookie.attributes)
        .code(200)
        .send({ status: 'OK' });
    },
  });

  server.route({
    method: 'POST',
    url: '/logout',
    schema: {
      response: {
        200: Type.Object({
          status: Type.String(),
        }),
      },
    },
    handler: async (request, reply) => {
      if (!request.ctx.session) {
        reply.code(200).send({ status: 'OK' });
        return;
      }

      await request.ctx.auth.invalidateSession(request.ctx.session.id);

      const cookie = request.ctx.auth.createBlankSessionCookie();

      reply
        .clearCookie(cookie.name, cookie.attributes)
        .code(200)
        .send({ status: 'OK' });
    },
  });

  // Token based login for mobile apps etc that can't use cookies

  server.route({
    method: 'POST',
    url: '/login-token',
    schema: {
      body: Type.Object({
        email: Type.String(),
        password: Type.String(),
      }),
      response: {
        200: Type.Object({
          sessionId: Type.String(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { sessionId } = await wrapLogin(
        sessionService.tokenLogin(request.ctx.db, {
          auth: request.ctx.auth,
          email: request.body.email,
          password: request.body.password,
        })
      );

      reply.code(200).send({ sessionId });
    },
  });

  server.route({
    method: 'POST',
    url: '/logout-token',
    schema: {
      response: {
        200: Type.Object({
          status: Type.String(),
        }),
      },
    },
    handler: async (request, reply) => {
      if (!request.ctx.session) {
        reply.code(200).send({ status: 'OK' });
        return;
      }

      await request.ctx.auth.invalidateSession(request.ctx.session.id);

      reply.code(200).send({ status: 'OK' });
    },
  });
}

// Helpers

/**
 * Wrapper function that races the login promise with a delay to prevent timing
 * attacks and maps internal login errors to GraphQL errors.
 */
async function wrapLogin<T>(loginPromise: Promise<T>) {
  /**
   * Simulate a delay to prevent timing attacks where attackers can determine
   * if an email exists in the system based on the response time.
   */
  const [result] = await Promise.allSettled([
    loginPromise,
    new Promise((resolve) => setTimeout(resolve, 2000)),
  ]);

  if (result.status === 'rejected') {
    if (
      result.reason instanceof sessionService.LoginError &&
      result.reason.name === 'LoginError'
    ) {
      const { status, message } = result.reason;

      // Map internal login error to GraphQL error
      if (status === 401) {
        throw ApiRouteError.unauthorized(message);
      } else if (status === 400) {
        throw ApiRouteError.badRequest(message);
      } else {
        throw ApiRouteError.internal();
      }
    } else {
      // Throw 500 for unexpected errors
      throw ApiRouteError.internal();
    }
  }

  return result.value;
}
