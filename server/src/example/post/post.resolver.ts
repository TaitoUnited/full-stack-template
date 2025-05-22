import { builder } from '~/setup/graphql/builder';
import { userService } from '../../user/user.service';
import { User } from '../../user/user.resolver';
import { postService } from './post.service';

const Post = builder.simpleObject('Post', {
  fields: (t) => ({
    id: t.string(),
    title: t.string(),
    content: t.string(),
    authorId: t.string(),
    createdAt: t.field({ type: 'Date' }),
  }),
});

export function setupResolvers() {
  builder.queryField('post', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: Post,
      nullable: true,
      args: { id: t.arg.string() },
      resolve: async (_, args, ctx) => {
        return postService.getPost(ctx, args.id);
      },
    })
  );

  builder.objectField(Post, 'author', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: User,
      nullable: true,
      resolve: async (parent, _, ctx) => {
        return userService.getOrgUser(ctx, parent.authorId);
      },
    })
  );

  builder.queryField('posts', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: [Post],
      args: { search: t.arg.string({ required: false }) },
      resolve: async (_, args, ctx) => {
        return postService.getPosts(ctx, args.search);
      },
    })
  );

  builder.mutationField('createPost', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: Post,
      args: { title: t.arg.string(), content: t.arg.string() },
      resolve: async (_, args, ctx) => {
        return postService.createPost(ctx, {
          ...args,
          authorId: ctx.user.id,
        });
      },
    })
  );
}
