import deepEqual from "fast-deep-equal";
import { useEffect } from "react";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { CharacterOrGameId } from "types/CharacterOrGameId.type";

import { AssetService, IAsset } from "services/asset.service";

import { useGameCharactersStore } from "./gameCharacters.store";

interface AssetsStoreState {
  gameAssets: Record<string, IAsset>;
  gameAssetsLoading: boolean;
  gameAssetsError: string | null;

  characterAssets: Record<string, Record<string, IAsset>>;
  characterAssetsLoading: boolean;
  characterAssetsError: string | null;
}

interface AssetsStoreActions {
  listenToGameAssets: (gameId: string) => () => void;
  listenToCharactersAssets: (characterIds: string[]) => () => void;

  addAsset: (
    gameId: string,
    characterId: string | undefined,
    asset: IAsset,
  ) => Promise<string>;
  toggleAssetAbility: (
    id: CharacterOrGameId,
    assetId: string,
    abilityIndex: number,
    checked: boolean,
  ) => Promise<void>;
  updateAssetOption: (
    id: CharacterOrGameId,
    assetId: string,
    assetOptionKey: string,
    value: string,
  ) => Promise<void>;
  updateAssetControl: (
    id: CharacterOrGameId,
    assetId: string,
    assetControlKey: string,
    value: string | boolean | number,
  ) => Promise<void>;
  deleteAsset: (id: CharacterOrGameId, assetId: string) => Promise<void>;

  reset: () => void;
}

const defaultState: AssetsStoreState = {
  gameAssets: {},
  gameAssetsError: null,
  gameAssetsLoading: true,

  characterAssets: {},
  characterAssetsError: null,
  characterAssetsLoading: true,
};

export const useAssetsStore = createWithEqualityFn<
  AssetsStoreState & AssetsStoreActions
>()(
  immer((set) => {
    return {
      ...defaultState,

      listenToGameAssets: (gameId: string) => {
        return AssetService.listenToGameAssets(
          gameId,
          (assets) => {
            set((state) => {
              state.gameAssets = assets;
              state.gameAssetsError = null;
              state.gameAssetsLoading = false;
            });
          },
          (error) => {
            set((state) => {
              state.gameAssetsLoading = false;
              state.gameAssetsError = error.message;
            });
          },
        );
      },
      listenToCharactersAssets: (characterIds: string[]) => {
        const unsubscribes = characterIds.map((characterId) => {
          return AssetService.listenToCharacterAssets(
            characterId,
            (assets) => {
              set((state) => {
                state.characterAssets[characterId] = assets;
                state.characterAssetsError = null;
                state.characterAssetsLoading = false;
              });
            },
            (error) => {
              set((state) => {
                state.characterAssetsLoading = false;
                state.characterAssetsError = error.message;
              });
            },
          );
        });
        return () => {
          unsubscribes.forEach((unsubscribe) => unsubscribe());
        };
      },

      addAsset: (gameId, characterId, asset) => {
        if (characterId && !asset.shared) {
          return AssetService.createCharacterAsset(characterId, asset);
        } else if (asset.shared) {
          return AssetService.createGameAsset(gameId, asset);
        }
        return Promise.reject();
      },
      toggleAssetAbility: (id, assetId, abilityId, checked) => {
        return AssetService.toggleAssetAbility(id, assetId, abilityId, checked);
      },
      updateAssetOption: (id, assetId, assetOptionKey, value) => {
        return AssetService.updateAssetOption(
          id,
          assetId,
          assetOptionKey,
          value,
        );
      },
      updateAssetControl: (id, assetId, assetControlKey, value) => {
        return AssetService.updateAssetControl(
          id,
          assetId,
          assetControlKey,
          value,
        );
      },
      deleteAsset: (id, assetId) => {
        return AssetService.deleteAsset(id, assetId);
      },

      reset: () => {
        set(() => ({
          gameAssets: {},
          characterAssets: {},
          loading: false,
          error: null,
        }));
      },
    };
  }),
  deepEqual,
);

export function useListenToGameAssets(gameId: string | undefined) {
  // Todo - get listeners and reset function and call

  const listenToGameAssets = useAssetsStore(
    (store) => store.listenToGameAssets,
  );
  const listenToCharacterAssets = useAssetsStore(
    (store) => store.listenToCharactersAssets,
  );
  const reset = useAssetsStore((store) => store.reset);

  const characterIds = useGameCharactersStore((store) =>
    Object.keys(store.characters),
  );

  useEffect(() => {
    if (gameId) {
      const unsubscribe = listenToGameAssets(gameId);
      return () => {
        unsubscribe();
        reset();
      };
    }
    return () => {
      reset();
    };
  }, [reset, listenToGameAssets, gameId]);

  useEffect(() => {
    if (gameId && characterIds.length) {
      return listenToCharacterAssets(characterIds);
    }
  }, [gameId, characterIds, listenToCharacterAssets]);
}
