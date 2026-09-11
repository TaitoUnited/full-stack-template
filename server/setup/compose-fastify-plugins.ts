import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type {
  FastifyPluginCallback,
  FastifyPluginAsync,
  FastifyPluginOptions,
  FastifyRegisterOptions,
  RawServerDefault,
} from 'fastify';
import type { Logger } from 'pino';

import type { ServerInstance } from './server';

type RawPlugin =
  | FastifyPluginCallback<
      FastifyPluginOptions,
      RawServerDefault,
      TypeBoxTypeProvider,
      Logger
    >
  | FastifyPluginAsync<
      FastifyPluginOptions,
      RawServerDefault,
      TypeBoxTypeProvider,
      Logger
    >;

type Plugin =
  | RawPlugin
  | { plugin: RawPlugin; opts: FastifyRegisterOptions<FastifyPluginOptions> };

export function composeFastifyPlugins(...plugins: Plugin[]) {
  return async (fastify: ServerInstance) => {
    for (const plugin of plugins) {
      if ('plugin' in plugin) {
        await fastify.register(plugin.plugin, plugin.opts);
      } else {
        await fastify.register(plugin);
      }
    }
  };
}
