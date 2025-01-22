import { createFileRoute, redirect } from '@tanstack/react-router';

import { logout } from '~/services/auth';
import { workspaceIdStore } from '~/stores/workspace-id-store';

export const Route = createFileRoute('/_app/')({
  beforeLoad: async () => {
    const workspaceId = workspaceIdStore.getState().workspaceId;

    if (workspaceId) {
      throw redirect({ to: `/${workspaceId}` });
    } else {
      await logout();
      throw redirect({ to: '/login' });
    }
  },
  // TODO: maybe implement some view for users that don't yet have workspaces?
});
