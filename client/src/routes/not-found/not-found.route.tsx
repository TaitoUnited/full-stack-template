import { createFileRoute } from '@tanstack/react-router';

import { NotFoundAuthenticated } from './not-found-authenticated';

export const Route = createFileRoute('/_app/$')({
  component: NotFoundAuthenticated,
});
