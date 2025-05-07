import { builder } from '~/setup/graphql/builder';
import { hasValidOrganisationRole } from '~/src/utils/authorisation';
import { GraphQLError } from '~/src/utils/error';
import { User } from '../../user/user.resolver';
import * as userService from '../../user/user.service';
import * as postService from './post.service';

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
        return postService.getPost(ctx.db, {
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
        return userService.getOrgUser(ctx.db, {
          id: parent.authorId,
          organisationId: ctx.organisationId,
        });
      },
    })
  );

  builder.queryField('posts', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: [Post],
      args: { search: t.arg.string({ required: false }) },
      resolve: async (_, args, ctx) => {
        return postService.getPosts(ctx.db, {
          ...args,
          organisationId: ctx.organisationId,
        });
      },
    })
  );

  builder.mutationField('createPost', (t) =>
    t.withAuth({ authenticated: true }).field({
      type: Post,
      args: { title: t.arg.string(), content: t.arg.string() },
      resolve: async (_, args, ctx) => {
        if (!hasValidOrganisationRole(ctx, 'admin', 'manager')) {
          throw GraphQLError.forbidden();
        }

        return postService.createPost(ctx.db, {
          ...args,
          authorId: ctx.user.id,
          organisationId: ctx.organisationId,
        });
      },
    })
  );
}
