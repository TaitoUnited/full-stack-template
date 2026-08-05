import { throwApiError } from '~/src/utils/error';
import type { AuthenticatedContext } from '~/setup/context';
import {
  checkOrganisationMembership,
  hasValidOrganisationRole,
  ROLES,
} from '~/src/utils/authorisation';
import { postDao } from './post.dao';

function getPosts(ctx: AuthenticatedContext, search?: string | null) {
  checkOrganisationMembership(ctx);

  return postDao.getPosts(ctx.db, {
    organisationId: ctx.organisationId,
    search,
  });
}

function getPost(ctx: AuthenticatedContext, id: string) {
  checkOrganisationMembership(ctx);

  return postDao.getPost(ctx.db, {
    organisationId: ctx.organisationId,
    id,
  });
}

function createPost(
  ctx: AuthenticatedContext,
  values: {
    title: string;
    content: string;
    authorId: string;
  }
) {
  checkOrganisationMembership(ctx);

  if (!hasValidOrganisationRole(ctx, ROLES.ADMIN, ROLES.MANAGER)) {
    throwApiError({
      initiator: ctx.initiator,
      errorType: 'forbidden',
      message: 'Creating posts only allowed for admin and manager roles',
    });
  }

  return postDao.createPost(ctx.db, {
    ...values,
    organisationId: ctx.organisationId,
  });
}

export const postService = {
  getPosts,
  getPost,
  createPost,
};
