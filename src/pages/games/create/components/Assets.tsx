import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import RemoveAssetIcon from "@mui/icons-material/Close";
import { Button, IconButton } from "@mui/material";

import { useCreateCharacterAtom } from "../atoms/createCharacter.atom";
import { AssetDocument } from "api-calls/assets/_asset.type";
import { AssetCard } from "components/datasworn/AssetCard";
import { AssetCardDialog } from "components/datasworn/AssetCardDialog/AssetCardDialog";
import { GridLayout } from "components/Layout";

export function Assets() {
  const [character, setCharacter] = useCreateCharacterAtom();
  const { t } = useTranslation();

  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = useState(false);

  const handleAssetControlChange = useCallback(
    (
      index: number,
      controlKey: string,
      value: string | boolean | number,
      shared: boolean,
    ) => {
      setCharacter((prev) => {
        const newAssets = [...prev[shared ? "gameAssets" : "characterAssets"]];
        const newAsset = {
          ...prev[shared ? "gameAssets" : "characterAssets"][index],
        };
        if (!newAsset.controlValues) {
          newAsset.controlValues = {};
        }
        newAsset.controlValues[controlKey] = value;
        newAssets[index] = newAsset;
        return { ...prev, assets: newAssets };
      });
    },
    [setCharacter],
  );

  const combinedAssets = [
    ...character.gameAssets,
    ...character.characterAssets,
  ];

  return (
    <>
      <GridLayout
        sx={{ mt: 2 }}
        items={combinedAssets}
        renderItem={(assetDocument, index) => (
          <AssetGridCard
            index={index}
            assetDocument={assetDocument}
            setCharacter={setCharacter}
            onAssetControlChange={handleAssetControlChange}
          />
        )}
        minWidth={300}
        emptyStateMessage={t(
          "character.create.add-asset-empty-state",
          "Add an asset now, or add one later from the character sheet.",
        )}
        emptyStateAction={
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setIsAddAssetDialogOpen(true)}
          >
            {t("character.create.add-asset", "Add Asset")}
          </Button>
        }
      />
      {combinedAssets.length > 0 && (
        <div>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setIsAddAssetDialogOpen(true)}
            sx={{ mt: 2 }}
          >
            {t("character.create.add-asset", "Add Asset")}
          </Button>
        </div>
      )}
      <AssetCardDialog
        open={isAddAssetDialogOpen}
        handleClose={() => setIsAddAssetDialogOpen(false)}
        handleAssetSelection={(asset) => {
          setCharacter((prev) => {
            const newCharacter = { ...prev };
            if (asset.shared) {
              const existingAssets = newCharacter.characterAssets;
              newCharacter.characterAssets = [
                ...newCharacter.characterAssets,
                {
                  ...asset,
                  order:
                    existingAssets.length > 0
                      ? existingAssets[existingAssets.length - 1].order + 1
                      : 0,
                },
              ];
            } else {
              const existingAssets = newCharacter.gameAssets;
              newCharacter.gameAssets = [
                ...newCharacter.gameAssets,
                {
                  ...asset,
                  order:
                    existingAssets.length > 0
                      ? existingAssets[existingAssets.length - 1].order + 1
                      : 0,
                },
              ];
            }
            return newCharacter;
          });
          setIsAddAssetDialogOpen(false);
        }}
      />
    </>
  );
}

interface AssetGridCardProps {
  index: number;
  assetDocument: AssetDocument;
  setCharacter: ReturnType<typeof useCreateCharacterAtom>[1];
  onAssetControlChange: (
    index: number,
    controlKey: string,
    value: string | boolean | number,
    shared: boolean,
  ) => void;
}

function AssetGridCard(props: AssetGridCardProps) {
  const { index, assetDocument, setCharacter, onAssetControlChange } = props;
  const { t } = useTranslation();

  const shared = assetDocument.shared;
  const handleAssetControlChange = useCallback(
    (controlKey: string, value: string | boolean | number) => {
      onAssetControlChange(index, controlKey, value, shared);
    },
    [onAssetControlChange, index, shared],
  );

  return (
    <AssetCard
      assetId={assetDocument.id}
      assetDocument={assetDocument}
      headerActions={
        <IconButton
          aria-label={t("character.assets.remove-asset", "Remove Asset")}
          onClick={() =>
            setCharacter((prev) => {
              if (assetDocument.shared) {
                const newAssets = [...prev.gameAssets];
                newAssets.splice(index, 1);
                return { ...prev, gameAssets: newAssets };
              } else {
                const newAssets = [...prev.characterAssets];
                newAssets.splice(index, 1);
                return { ...prev, characterAssets: newAssets };
              }
            })
          }
        >
          <RemoveAssetIcon />
        </IconButton>
      }
      onAssetAbilityToggle={(abilityIndex, checked) => {
        setCharacter((prev) => {
          const newAssets = [
            ...prev[shared ? "gameAssets" : "characterAssets"],
          ];

          const newAsset = { ...newAssets[index] };
          newAsset.enabledAbilities[abilityIndex] = checked;
          newAssets[index] = newAsset;
          return {
            ...prev,
            [shared ? "gameAssets" : "characterAssets"]: newAssets,
          };
        });
      }}
      onAssetControlChange={handleAssetControlChange}
      onAssetOptionChange={(optionKey, value) => {
        setCharacter((prev) => {
          const newAssets = [
            ...prev[shared ? "gameAssets" : "characterAssets"],
          ];

          const newAsset = { ...newAssets[index] };
          if (!newAsset.optionValues) {
            newAsset.optionValues = {};
          }
          newAsset.optionValues[optionKey] = value;
          newAssets[index] = newAsset;
          return {
            ...prev,
            [shared ? "gameAssets" : "characterAssets"]: newAssets,
          };
        });
      }}
      sx={{ height: "100%", width: "100%" }}
    />
  );
}
