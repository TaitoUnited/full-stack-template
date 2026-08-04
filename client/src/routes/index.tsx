import { createFileRoute, redirect } from '@tanstack/react-router';

import { logout } from '~/stores/auth-store';
import { workspaceIdStore } from '~/stores/workspace-store';

export const Route = createFileRoute('/_app/')({
  beforeLoad: async () => {
    const workspaceId = workspaceIdStore.getState().workspaceId;

    if (workspaceId) {
      return redirect({ to: `/$workspaceId`, params: { workspaceId } });
    }

    await logout();
    return redirect({ to: '/login' });
  },
  // TODO: maybe implement some view for users that don't yet have workspaces?
});
