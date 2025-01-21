// Zustand store for workspace state
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getApolloClient } from '~graphql';

export type WorkspaceStore = {
  workspaceId: string;
  setWorkspaceId: (id: string) => void;
};

/**
 * Store workspaceId in global state and use it in x-workspace-id header in Apollo
 *
 * NOTE: Zustand supports using the store instance in and outside of React
 * components. Use the `useWorkspaceIdStore` hook in React components and the
 * `workspaceIdStore` instance outside of React components.
 */
export const workspaceIdStore = create<WorkspaceStore>()(
  persist(
    set => ({
      workspaceId: '',
      setWorkspaceId: (id: string) => {
        set({ workspaceId: id });
        // Reset Apollo cache to refetch queries with new workspace id
        getApolloClient().resetStore();
      },
    }),
    {
      name: 'workspace-id',
    }
  )
);

export const useWorkspaceIdStore = workspaceIdStore;
