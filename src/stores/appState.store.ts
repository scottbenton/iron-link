// Rolls, announcements, datasworn dialog, themes
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/vanilla/shallow";

import { ColorScheme } from "repositories/shared.types";

interface AppStateState {
  announcement: string | null;
  dataswornDialogState: {
    isOpen: boolean;
    openId?: string;
    previousIds: string[];
  };
  colorScheme: ColorScheme;
}

interface AppStateActions {
  setAnnouncement: (announcement: string) => void;

  openDataswornDialog: (id: string) => void;
  closeDataswornDialog: () => void;
  prevDataswornDialog: () => void;

  setColorScheme: (colorScheme: ColorScheme) => void;
}

export const useAppState = createWithEqualityFn<
  AppStateState & AppStateActions
>()(
  immer((set) => ({
    announcement: null,
    dataswornDialogState: {
      isOpen: false,
      previousIds: [],
    },
    colorScheme: ColorScheme.Default,

    setAnnouncement: (announcement) => set({ announcement }),

    openDataswornDialog: (id) => {
      set((state) => {
        if (state.dataswornDialogState.isOpen) {
          state.dataswornDialogState.previousIds.push(
            state.dataswornDialogState.openId!,
          );
        } else {
          state.dataswornDialogState.previousIds = [];
        }
        state.dataswornDialogState.isOpen = true;
        state.dataswornDialogState.openId = id;
      });
    },
    closeDataswornDialog: () => {
      set((state) => {
        state.dataswornDialogState.isOpen = false;
      });
    },
    prevDataswornDialog: () => {
      set((state) => {
        if (state.dataswornDialogState.previousIds.length > 0) {
          const newOpenId = state.dataswornDialogState.previousIds.pop();
          state.dataswornDialogState.openId = newOpenId;
        }
      });
    },
    setColorScheme: (colorScheme) => {
      set((state) => {
        state.colorScheme = colorScheme;
      });
    },
  })),
  shallow,
);

export function useAnnouncement() {
  return useAppState((state) => state.announcement);
}

export function useSetAnnouncement() {
  return useAppState((state) => state.setAnnouncement);
}

export function useOpenDataswornDialog() {
  return useAppState((state) => state.openDataswornDialog);
}

export function useSetColorScheme() {
  return useAppState((state) => state.setColorScheme);
}
