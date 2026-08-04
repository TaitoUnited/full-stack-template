import fastifyPlugin from 'fastify-plugin';

import { uiAuthPlugin as ui } from './ui';
import { publicAuthPlugin as allowed } from './public';
import { basicAuthPlugin as basic } from './basic';

export { withUser } from './ui';

export const auth = {
  ui,
  allowed,
  basic,
};

export const disableNotAuthenticated = fastifyPlugin(async (server) => {
  /**
   * NOTE: purpose of this is to make tests fail in case of
   * incomplete authentication configuration.
   * This SHOULD NOT be considered a safety measure!
   */
  server.addHook('onSend', async (request, reply) => {
    const { log, __authenticator__, error } = request.ctx;

    if (error) {
      // If an error occurred, we don't care.
      return;
    }

    const status = reply.statusCode;
    if (!__authenticator__ && status !== 404) {
      log.error('request was not authenticated');
      reply.hijack();

      reply.raw.writeHead(500, {
        'X-RequestId': request.id,
        'content-type': 'text/plain',
      });
      reply.raw.write(
        'Request was not authenticated!!\n' +
          'If you see this, you should fix your authentication code.\n\n' +
          `Original status: ${status}\n`
      );
      reply.raw.end();
    } else {
      log.trace(`Request was authenticated using "${__authenticator__}"`);
    }
  });
});
