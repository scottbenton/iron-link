import { AssetDocument } from "api-calls/assets/_asset.type";
import { updateAsset } from "api-calls/assets/updateAsset";
import { updateAssetCheckbox } from "api-calls/assets/updateAssetCheckbox";
import { AssetCard } from "components/datasworn/AssetCard";
import React, { useCallback } from "react";

export interface AssetsSectionCardProps {
  doesUserOwnCharacter: boolean;
  assetId: string;
  assetDocument: AssetDocument;
  characterId: string;
  campaignId: string;
  showUnavailableAbilities: boolean;
}

function AssetsSectionCardUnMemoized(props: AssetsSectionCardProps) {
  const {
    doesUserOwnCharacter,
    assetId,
    assetDocument,
    characterId,
    campaignId,
    showUnavailableAbilities,
  } = props;

  const shared = assetDocument.shared;
  const handleAssetAbilityToggle = useCallback(
    (abilityIndex: number, checked: boolean) => {
      updateAssetCheckbox({
        characterId: shared ? undefined : characterId,
        campaignId: shared ? campaignId : undefined,
        assetId,
        abilityIndex,
        checked,
      }).catch(() => {});
    },
    [shared, characterId, campaignId, assetId]
  );

  const handleAssetOptionChange = useCallback(
    (assetOptionKey: string, value: string) => {
      updateAsset({
        characterId: shared ? undefined : characterId,
        campaignId: shared ? campaignId : undefined,
        assetId,
        asset: {
          [`optionValues.${assetOptionKey}`]: value,
        },
      }).catch(() => {});
    },
    [shared, assetId, characterId, campaignId]
  );

  const handleAssetControlChange = useCallback(
    (controlKey: string, controlValue: boolean | string | number) => {
      updateAsset({
        characterId: shared ? undefined : characterId,
        campaignId: shared ? campaignId : undefined,
        assetId,
        asset: {
          [`controlValues.${controlKey}`]: controlValue,
        },
      }).catch(() => {});
    },
    [shared, assetId, characterId, campaignId]
  );

  return (
    <AssetCard
      showSharedIcon
      assetId={assetDocument.id}
      assetDocument={assetDocument}
      onAssetAbilityToggle={
        doesUserOwnCharacter ? handleAssetAbilityToggle : undefined
      }
      onAssetOptionChange={
        doesUserOwnCharacter ? handleAssetOptionChange : undefined
      }
      onAssetControlChange={
        doesUserOwnCharacter ? handleAssetControlChange : undefined
      }
      hideUnavailableAbilities={!showUnavailableAbilities}
    />
  );
}
export const AssetsSectionCard = React.memo(AssetsSectionCardUnMemoized);
