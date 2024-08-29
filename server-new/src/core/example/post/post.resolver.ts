import { builder } from '~/setup/graphql/builder';
import { User } from '../../user/user.resolver';
import * as userService from '../../user/user.service';
import * as postService from './post.service';

const Post = builder.simpleObject('Post', {
  fields: (t) => ({
    id: t.string(),
    title: t.string(),
    content: t.string(),
    authorId: t.string(),
  }),
});

export function setupResolvers() {
  builder.queryField('post', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: Post,
      nullable: true,
      args: { id: t.arg.string() },
      resolve: async (_, args, ctx) => {
        return postService.getPost(ctx.db, args.id);
      },
    })
  );

  builder.objectField(Post, 'author', (t) =>
    t.field({
      type: User,
      nullable: true,
      resolve: async (parent, _, ctx) => {
        return userService.getUser(ctx.db, parent.authorId);
      },
    })
  );

  builder.queryField('posts', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: [Post],
      args: { search: t.arg.string({ required: false }) },
      resolve: async (_, args, ctx) => {
        return postService.getPosts(ctx.db, args);
      },
    })
  );

  builder.mutationField('createPost', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: Post,
      args: { title: t.arg.string(), content: t.arg.string() },
      resolve: async (_, args, ctx) => {
        return ctx.db.transaction((tx) => {
          return postService.createPost(tx, { ...args, authorId: ctx.user.id });
        });
      },
    })
  );
}
