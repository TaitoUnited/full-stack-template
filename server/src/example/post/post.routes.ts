import { Type } from '@sinclair/typebox';

import { withAuth } from '~/setup/auth';
import { type ServerInstance } from '~/setup/server';
import { postController } from '~/src/example/post/post.controller';

export async function postRoutes(server: ServerInstance) {
  server.route({
    method: 'GET',
    url: '/posts',
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
    handler: withAuth(async (request) => {
      const posts = await postController.getPosts(request.ctx);

      return posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt.toISOString(),
      }));
    }),
  });
}
