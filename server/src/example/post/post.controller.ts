import { throwApiError } from '~/setup/error';
import { AuthenticatedContext } from '~/setup/context';
import {
  checkOrganisationMembership,
  hasValidOrganisationRole,
  ROLES,
} from '~/src/utils/authorisation';
import { postService } from './post.service';

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
    throwApiError({
      originApi: ctx.originApi,
      errorType: 'forbidden',
      message: 'Creating posts only allowed for admin and manager roles',
    });
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
