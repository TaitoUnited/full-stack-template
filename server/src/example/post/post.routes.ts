import { Type } from '@sinclair/typebox';

import { type ServerInstance } from '~/setup/server';
import * as postsService from '~/src/example/post/post.service';

export async function postRoutes(server: ServerInstance) {
  server.route({
    method: 'GET',
    url: '/posts',
    preHandler: [server.authenticate],
    schema: {
      response: {
        200: Type.Array(
          Type.Object({
            id: Type.String(),
            title: Type.String(),
            content: Type.String(),
            createdAt: Type.String(),
          })
        ),
      },
    },
    handler: async (request) => {
      const posts = await postsService.getPosts(request.ctx.db, {
        organisationId: request.ctx.organisationId,
      });

      return posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt.toISOString(),
      }));
    },
  });
}
