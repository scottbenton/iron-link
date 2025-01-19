import deepEqual from "fast-deep-equal";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { IWorld, WorldsService } from "services/worlds.service";

interface WorldState {
  world: IWorld | null;
  loading: boolean;
  error?: Error;

  worldPermissions: {
    hasGuideAccess: boolean;
    canEditDocs: boolean;
    canDeleteDocs: boolean;
    isOwner: boolean;
  };
}

interface WorldActions {
  listenToWorld: (uid: string, worldId: string) => () => void;
}

const defaultValues: WorldState = {
  world: null,
  loading: true,
  error: undefined,

  worldPermissions: {
    hasGuideAccess: false,
    canEditDocs: false,
    canDeleteDocs: false,
    isOwner: false,
  },
};

export const useWorld = createWithEqualityFn<WorldState & WorldActions>()(
  immer((set) => ({
    ...defaultValues,

    listenToWorld: (uid, worldId) => {
      const unsubscribe = WorldsService.listenToWorld(
        uid,
        worldId,
        (world) => {
          set((state) => {
            state.loading = false;
            state.world = world;
            state.error = undefined;
          });
        },
        (error) => {
          set((state) => {
            state.loading = false;
            state.error = error;
          });
        },
      );

      return unsubscribe;
    },
  })),
  deepEqual,
);
