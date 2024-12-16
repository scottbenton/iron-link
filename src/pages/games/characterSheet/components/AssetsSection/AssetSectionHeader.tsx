import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { Box } from "@mui/material";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { AssetCardDialog } from "components/datasworn/AssetCardDialog/AssetCardDialog";

import { useAssetsStore } from "stores/assets.store";

import { IAsset } from "services/asset.service";

export interface AssetsSectionHeaderProps {
  gameId: string;
  characterId: string | undefined;
  showAllAbilities: boolean;
  setShowAllAbilities: (showAllAbilities: boolean) => void;
  lastSharedAssetOrder: number;
  lastCharacterAssetOrder: number;
  doesUserOwnCharacter: boolean;
}

export function AssetSectionHeader(props: AssetsSectionHeaderProps) {
  const {
    gameId,
    characterId,
    showAllAbilities,
    setShowAllAbilities,
    lastSharedAssetOrder,
    lastCharacterAssetOrder,
    doesUserOwnCharacter,
  } = props;
  const { t } = useTranslation();

  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);

  const addAsset = useAssetsStore((store) => store.addAsset);

  const handleAssetSelection = useCallback(
    (assetDocument: Omit<IAsset, "order">) => {
      setIsAssetDialogOpen(false);
      addAsset(gameId, characterId, {
        ...assetDocument,
        order: assetDocument.shared
          ? lastSharedAssetOrder + 1
          : lastCharacterAssetOrder + 1,
      });
    },
    [
      characterId,
      gameId,
      lastCharacterAssetOrder,
      lastSharedAssetOrder,
      addAsset,
    ],
  );

  return (
    <Box
      mx={-2}
      mt={-2}
      px={2}
      py={1}
      bgcolor={(theme) =>
        theme.palette.mode === "light" ? "grey.300" : "grey.700"
      }
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <FormControlLabel
        label={t(
          "character.character-sidebar.expand-assets",
          "Show all abilities",
        )}
        control={
          <Checkbox
            checked={showAllAbilities}
            onChange={(_, checked) => setShowAllAbilities(checked)}
          />
        }
      />
      {doesUserOwnCharacter && (
        <>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setIsAssetDialogOpen(true)}
          >
            {t("character.character-sidebar.add-assets", "Add Assets")}
          </Button>
          <AssetCardDialog
            open={isAssetDialogOpen}
            handleClose={() => setIsAssetDialogOpen(false)}
            handleAssetSelection={handleAssetSelection}
          />
        </>
      )}
    </Box>
  );
}
