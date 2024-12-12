import deepEqual from "fast-deep-equal";
import { useEffect } from "react";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { CharacterService } from "services/character.service";

interface CharacterStoreState {
  portraits: Record<
    string,
    {
      url?: string;
      filename: string;
      loading: boolean;
    }
  >;
}

interface CharacterStoreActions {
  loadCharacterPortrait: (
    characterId: string,
    filename: string | undefined,
  ) => void;
}

export const useCharacterStore = createWithEqualityFn<
  CharacterStoreState & CharacterStoreActions
>()(
  immer((set, getState) => ({
    portraits: {},

    loadCharacterPortrait: (characterId, filename) => {
      const portraits = getState().portraits;
      if (filename) {
        // If the filename has changed since our last load, or we haven't loaded the portrait yet
        if (
          portraits[characterId]?.filename !== filename ||
          (!portraits[characterId]?.url && !portraits[characterId]?.loading)
        ) {
          set((store) => {
            store.portraits[characterId] = {
              url: undefined,
              filename,
              loading: true,
            };
          });
          CharacterService.getCharacterPortraitURL(characterId, filename)
            .then((url) => {
              set((store) => {
                store.portraits[characterId] = {
                  url,
                  filename,
                  loading: false,
                };
              });
            })
            .catch(() => {
              set((store) => {
                store.portraits[characterId] = {
                  url: undefined,
                  filename,
                  loading: false,
                };
              });
            });
        }
      } else if (portraits[characterId]) {
        set((store) => {
          delete store.portraits[characterId];
        });
      }
    },
  })),
  deepEqual,
);

export function useCharacterPortrait(characterId: string) {
  const portrait = useCharacterStore((store) => store.portraits[characterId]);
  return portrait ?? { url: undefined, filename: "", loading: false };
}

export function useLoadCharacterPortrait(
  characterId: string,
  filename?: string,
) {
  const loadCharacterPortrait = useCharacterStore(
    (store) => store.loadCharacterPortrait,
  );

  useEffect(() => {
    loadCharacterPortrait(characterId, filename);
  }, [characterId, filename, loadCharacterPortrait]);
}
