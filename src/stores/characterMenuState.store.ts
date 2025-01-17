import deepEqual from "fast-deep-equal";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

interface CharacterMenuStateState {
  isCharacterDetailsDialogOpen: boolean;
  isCharacterStatsDialogOpen: boolean;
  isColorSchemeDialogOpen: boolean;
}

interface CharacterMenuStateActions {
  setIsCharacterDetailsDialogOpen: (open: boolean) => void;
  setIsCharacterStatsDialogOpen: (open: boolean) => void;
  setIsColorSchemeDialogOpen: (open: boolean) => void;
}

export const useCharacterMenuState = createWithEqualityFn<
  CharacterMenuStateState & CharacterMenuStateActions
>()(
  immer((set) => ({
    isCharacterDetailsDialogOpen: false,
    isCharacterStatsDialogOpen: false,
    isColorSchemeDialogOpen: false,

    setIsCharacterDetailsDialogOpen: (open) => {
      set((state) => {
        state.isCharacterDetailsDialogOpen = open;
      });
    },
    setIsCharacterStatsDialogOpen: (open) => {
      set((state) => {
        state.isCharacterStatsDialogOpen = open;
      });
    },
    setIsColorSchemeDialogOpen: (open) => {
      set((state) => {
        state.isColorSchemeDialogOpen = open;
      });
    },
  })),
  deepEqual,
);
