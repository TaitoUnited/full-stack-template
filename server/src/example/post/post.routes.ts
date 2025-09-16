import { Type } from '@sinclair/typebox';

import { withUser } from '~/setup/auth';
import { type ServerInstance } from '~/setup/server';
import { postService } from '~/src/example/post/post.service';

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
    handler: withUser(async (request) => {
      const posts = await postService.getPosts(request.ctx);

      return posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt.toISOString(),
      }));
    }),
  });
}
