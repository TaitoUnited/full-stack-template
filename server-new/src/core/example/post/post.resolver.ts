import { builder } from '~/setup/graphql/builder';
import { User } from '../user/user.resolver';
import * as postService from './post.service';

const Post = builder.simpleObject('Post', {
  fields: (t) => ({
    id: t.id(),
    name: t.string(),
    author: t.field({ type: User, nullable: false }),
  }),
});

export function setupResolvers() {
  builder.queryField('post', (t) =>
    t.field({
      type: Post,
      args: {
        id: t.arg.int({ required: true }),
      },
      resolve: async (_, args) => {
        return postService.getPost(args.id);
      },
    })
  );

  builder.queryField('posts', (t) =>
    t.field({
      type: [Post],
      nullable: false,
      args: {
        search: t.arg.string(),
      },
      resolve: async () => {
        return postService.getPosts();
      },
    })
  );

  builder.mutationField('createPost', (t) =>
    t.field({
      type: Post,
      args: {
        name: t.arg.string({ required: true }),
      },
      resolve: async (_, args) => {
        return postService.createPost(args.name);
      },
    })
  );
}
