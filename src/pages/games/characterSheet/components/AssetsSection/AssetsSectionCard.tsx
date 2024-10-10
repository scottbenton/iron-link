import { IconButton, Tooltip } from "@mui/material";
import { AssetDocument } from "api-calls/assets/_asset.type";
import { removeAsset } from "api-calls/assets/removeAsset";
import { updateAsset } from "api-calls/assets/updateAsset";
import { updateAssetCheckbox } from "api-calls/assets/updateAssetCheckbox";
import { AssetCard } from "components/datasworn/AssetCard";
import { useConfirm } from "material-ui-confirm";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const { t } = useTranslation();

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

  const confirm = useConfirm();
  const handleDeleteAsset = useCallback(() => {
    confirm({
      title: t(
        "character.character-sidebar.delete-asset-dialog-title",
        "Delete Asset"
      ),
      description: t(
        "character.character-sidebar.delete-asset-dialog-description",
        "Are you sure you want to delete this asset?"
      ),
      confirmationText: t("common.delete", "Delete"),
    })
      .then(() => {
        removeAsset({
          characterId: shared ? undefined : characterId,
          campaignId: shared ? campaignId : undefined,
          assetId,
        });
      })
      .catch(() => {});
  }, [confirm, t, characterId, campaignId, shared, assetId]);

  return (
    <AssetCard
      showSharedIcon
      headerActions={
        <Tooltip
          title={t(
            "character.character-sidebar.delete-asset-dialog-title",
            "Delete Asset"
          )}
        >
          <IconButton onClick={handleDeleteAsset} color="inherit">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      }
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
