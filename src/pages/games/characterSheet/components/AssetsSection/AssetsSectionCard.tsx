import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { AssetCard } from "components/datasworn/AssetCard";

import { CharacterOrGameId } from "types/CharacterOrGameId.type";

import { useAssetsStore } from "stores/assets.store";

import { IAsset } from "services/asset.service";

export interface AssetsSectionCardProps {
  id: CharacterOrGameId;
  doesUserOwnCharacter: boolean;
  assetId: string;
  assetDocument: IAsset;
  showUnavailableAbilities: boolean;
}

function AssetsSectionCardUnMemoized(props: AssetsSectionCardProps) {
  const {
    id,
    doesUserOwnCharacter,
    assetId,
    assetDocument,
    showUnavailableAbilities,
  } = props;
  const { t } = useTranslation();

  const toggleAssetAbility = useAssetsStore(
    (store) => store.toggleAssetAbility,
  );
  const handleAssetAbilityToggle = useCallback(
    (abilityIndex: number, checked: boolean) => {
      toggleAssetAbility(id, assetId, abilityIndex, checked).catch(() => {});
    },
    [id, assetId, toggleAssetAbility],
  );

  const updateAssetOption = useAssetsStore((store) => store.updateAssetOption);
  const handleAssetOptionChange = useCallback(
    (assetOptionKey: string, value: string) => {
      updateAssetOption(id, assetId, assetOptionKey, value).catch(() => {});
    },
    [assetId, id, updateAssetOption],
  );

  const updateAssetControl = useAssetsStore(
    (store) => store.updateAssetControl,
  );
  const handleAssetControlChange = useCallback(
    (controlKey: string, controlValue: boolean | string | number) => {
      updateAssetControl(id, assetId, controlKey, controlValue).catch(() => {});
    },
    [id, assetId, updateAssetControl],
  );

  const confirm = useConfirm();
  const deleteAsset = useAssetsStore((store) => store.deleteAsset);
  const handleDeleteAsset = useCallback(() => {
    confirm({
      title: t(
        "character.character-sidebar.delete-asset-dialog-title",
        "Delete Asset",
      ),
      description: t(
        "character.character-sidebar.delete-asset-dialog-description",
        "Are you sure you want to delete this asset?",
      ),
      confirmationText: t("common.delete", "Delete"),
    })
      .then(() => {
        deleteAsset(id, assetId).catch(() => {});
      })
      .catch(() => {});
  }, [confirm, t, id, assetId, deleteAsset]);

  return (
    <AssetCard
      showSharedIcon
      headerActions={
        <Tooltip
          title={t(
            "character.character-sidebar.delete-asset-dialog-title",
            "Delete Asset",
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
