import {
  checkOrganisationMembership,
  hasValidOrganisationRole,
  ROLES,
} from '~/src/utils/authorisation';
import { GraphQLError } from '~/src/utils/error';
import { postService } from './post.service';
import { AuthenticatedContext } from '~/setup/context';

async function getPosts(ctx: AuthenticatedContext, search?: string | null) {
  checkOrganisationMembership(ctx);

  const params = {
    organisationId: ctx.organisationId,
    search,
  };
  return await postService.getPosts(ctx.db, params);
}

async function getPost(ctx: AuthenticatedContext, id: string) {
  checkOrganisationMembership(ctx);

  const params = {
    organisationId: ctx.organisationId,
    id,
  };
  return await postService.getPost(ctx.db, params);
}

async function createPost(
  ctx: AuthenticatedContext,
  values: {
    title: string;
    content: string;
    authorId: string;
  }
) {
  checkOrganisationMembership(ctx);

  if (!hasValidOrganisationRole(ctx, ROLES.ADMIN, ROLES.MANAGER)) {
    throw GraphQLError.forbidden();
  }

  return await postService.createPost(ctx.db, {
    ...values,
    organisationId: ctx.organisationId,
  });
}

export const postController = {
  getPosts,
  getPost,
  createPost,
};
