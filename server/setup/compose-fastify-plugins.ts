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
    console.log(
      'registering plugins: ',
      plugins.map((p) => ('plugin' in p ? p.plugin.name : p.name))
    );
    for (const plugin of plugins) {
      if ('plugin' in plugin) {
        console.log(`Registering plugin in plugin: ${plugin.plugin.name}`);
        await fastify.register(plugin.plugin, plugin.opts);
        console.log(`Registered plugin in plugin: ${plugin.plugin.name}`);
      } else {
        console.log(`Registering plugin: ${plugin.name}`);
        await fastify.register(plugin);
        console.log(`Registered plugin: ${plugin.name}`);
      }
    }
  };
}
