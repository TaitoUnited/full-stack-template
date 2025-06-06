import { throwApiError } from '~/src/utils/error';
import { AuthenticatedContext } from '~/setup/context';
import {
  checkOrganisationMembership,
  hasValidOrganisationRole,
  ROLES,
} from '~/src/utils/authorisation';
import { postService } from './post.service';

async function getPosts(ctx: AuthenticatedContext, search?: string | null) {
  checkOrganisationMembership(ctx);

  return await postService.getPosts(ctx.db, {
    organisationId: ctx.organisationId,
    search,
  });
}

async function getPost(ctx: AuthenticatedContext, id: string) {
  checkOrganisationMembership(ctx);

  return await postService.getPost(ctx.db, {
    organisationId: ctx.organisationId,
    id,
  });
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
