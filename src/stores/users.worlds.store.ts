import deepEqual from "fast-deep-equal";
import { useEffect } from "react";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { IMinimalWorld, WorldsService } from "services/worlds.service";

import { useUID } from "./auth.store";

export interface UsersWorldsState {
  worlds: IMinimalWorld[];
  loading: boolean;
  error?: Error;
}

interface UsersWorldsActions {
  loadUsersWorlds: (uid: string) => Promise<void>;
  createWorld: (uid: string, name: string) => Promise<string>;
}

const defaultValues: UsersWorldsState = {
  worlds: [],
  loading: true,
  error: undefined,
};

export const useUsersWorlds = createWithEqualityFn<
  UsersWorldsState & UsersWorldsActions
>()(
  immer((set) => ({
    ...defaultValues,

    loadUsersWorlds: async (uid) => {
      try {
        const worlds = await WorldsService.getUsersWorlds(uid);
        set((state) => {
          state.loading = false;
          state.worlds = worlds.sort((a, b) => a.name.localeCompare(b.name));
          state.error = undefined;
        });
      } catch {
        set((state) => {
          state.loading = false;
          state.error = new Error("Failed to load user's worlds");
        });
      }
    },

    createWorld: (uid, name) => {
      return WorldsService.createWorld(uid, name);
    },
  })),
  deepEqual,
);

export function useLoadUsersWorlds() {
  const uid = useUID();
  const { loadUsersWorlds } = useUsersWorlds((state) => state);

  useEffect(() => {
    if (uid) {
      loadUsersWorlds(uid);
    }
  }, [uid, loadUsersWorlds]);
}
