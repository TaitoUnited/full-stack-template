import type {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyRegisterOptions,
} from 'fastify';

import type { ServerInstance } from './server';

type ServerBase =
  ServerInstance extends FastifyInstance<infer Base> ? Base : never;

type RawPlugin = FastifyPluginCallback<any, ServerBase>;
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
