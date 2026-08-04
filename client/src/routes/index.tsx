import { createFileRoute, redirect } from '@tanstack/react-router';

import { logout } from '~/stores/auth-store';
import { workspaceIdStore } from '~/stores/workspace-store';

export const Route = createFileRoute('/_app/')({
  beforeLoad: async () => {
    const workspaceId = workspaceIdStore.getState().workspaceId;

    if (workspaceId) {
      redirect({
        to: `/$workspaceId`,
        params: { workspaceId },
        throw: true,
      });
    }

    await logout();

    redirect({
      to: '/login',
      throw: true,
    });
  },
  // TODO: maybe implement some view for users that don't yet have workspaces?
});
