import { builder } from '~/setup/graphql/builder';
import { User } from '../../user/user.resolver';
import { userController } from '../../user/user.controller';
import { postController } from './post.controller';

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
        return postController.getPost(ctx, {
          id: args.id,
          organisationId: ctx.organisationId,
        });
      },
    })
  );

  builder.objectField(Post, 'author', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: User,
      nullable: true,
      resolve: async (parent, _, ctx) => {
        return userController.getOrgUser(ctx, parent.authorId);
      },
    })
  );

  builder.queryField('posts', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: [Post],
      args: { search: t.arg.string({ required: false }) },
      resolve: async (_, args, ctx) => {
        return postController.getPosts(ctx, args.search);
      },
    })
  );

  builder.mutationField('createPost', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: Post,
      args: { title: t.arg.string(), content: t.arg.string() },
      resolve: async (_, args, ctx) => {
        return postController.createPost(ctx, {
          ...args,
          authorId: ctx.user.id,
        });
      },
    })
  );
}
