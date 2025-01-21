import { createFileRoute } from '@tanstack/react-router';

import { InternalErrorAuthenticated } from '../internal-error/internal-error-authenticated';
import { NotFoundAuthenticated } from '../not-found/not-found-authenticated';

export const Route = createFileRoute('/_app/$workspaceId')({
  errorComponent: InternalErrorAuthenticated,
  notFoundComponent: NotFoundAuthenticated,
});
