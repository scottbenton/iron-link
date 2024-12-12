import { Box } from "@mui/material";
import { useMemo, useState } from "react";

import { useDerivedCampaignState } from "pages/games/gamePageLayout/hooks/useDerivedCampaignState";
import { useGameId } from "pages/games/gamePageLayout/hooks/useGameId";

import { useCharacterId } from "../../hooks/useCharacterId";
import { useDerivedCurrentCharacterState } from "../../hooks/useDerivedCharacterState";
import { useIsOwnerOfCharacter } from "../../hooks/useIsOwnerOfCharacter";
import { AssetSectionHeader } from "./AssetSectionHeader";
import { AssetsSectionCard } from "./AssetsSectionCard";

export function AssetsSection() {
  const characterId = useCharacterId();
  const campaignId = useGameId();

  const characterAssets = useDerivedCurrentCharacterState(
    (character) => character?.assets?.assets ?? {},
  );
  const sortedCharacterAssets = useMemo(
    () =>
      Object.entries(characterAssets).sort(([, a], [, b]) => {
        return a.order - b.order;
      }),
    [characterAssets],
  );
  const lastCharacterAssetOrder = useMemo(() => {
    if (sortedCharacterAssets.length !== 0) {
      return sortedCharacterAssets[sortedCharacterAssets.length - 1][1].order;
    }
    return 0;
  }, [sortedCharacterAssets]);
  const sharedAssets = useDerivedCampaignState(
    (state) => state.sharedAssets.assets,
  );
  const sortedSharedAssets = useMemo(
    () =>
      Object.entries(sharedAssets).sort(([, a], [, b]) => {
        return a.order - b.order;
      }),
    [sharedAssets],
  );
  const lastSharedAssetOrder = useMemo(() => {
    if (sortedSharedAssets.length !== 0) {
      return sortedSharedAssets[sortedSharedAssets.length - 1][1].order;
    }
    return 0;
  }, [sortedSharedAssets]);

  const doesUserOwnCharacter = useIsOwnerOfCharacter();

  const [showAllAbilities, setShowAllAbilities] = useState(false);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <AssetSectionHeader
        campaignId={campaignId}
        characterId={characterId}
        showAllAbilities={showAllAbilities}
        setShowAllAbilities={setShowAllAbilities}
        lastCharacterAssetOrder={lastCharacterAssetOrder}
        lastSharedAssetOrder={lastSharedAssetOrder}
        doesUserOwnCharacter={doesUserOwnCharacter}
      />
      {sortedSharedAssets.map(([assetId, asset]) => (
        <AssetsSectionCard
          key={assetId}
          doesUserOwnCharacter={doesUserOwnCharacter}
          campaignId={campaignId}
          characterId={characterId}
          assetId={assetId}
          assetDocument={asset}
          showUnavailableAbilities={showAllAbilities}
        />
      ))}
      {sortedCharacterAssets.map(([assetId, asset]) => (
        <AssetsSectionCard
          key={assetId}
          doesUserOwnCharacter={doesUserOwnCharacter}
          campaignId={campaignId}
          characterId={characterId}
          assetId={assetId}
          assetDocument={asset}
          showUnavailableAbilities={showAllAbilities}
        />
      ))}
    </Box>
  );
}
