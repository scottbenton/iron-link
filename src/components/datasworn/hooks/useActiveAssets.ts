import { useParams } from "react-router-dom";

import { useAssetsStore } from "stores/assets.store";

export function useActiveAssets() {
  const { characterId } = useParams<{
    characterId?: string;
  }>();

  const characterAssets = useAssetsStore((store) =>
    characterId ? (store.characterAssets[characterId] ?? {}) : {},
  );
  const gameAssets = useAssetsStore((store) => store.gameAssets);

  return { characterAssets, gameAssets };
}
