import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";

import { AssetDocument } from "api-calls/assets/_asset.type";
import { addAsset } from "api-calls/assets/addAsset";
import { AssetCardDialog } from "components/datasworn/AssetCardDialog/AssetCardDialog";

export interface AssetsSectionHeaderProps {
  campaignId: string;
  characterId: string;
  showAllAbilities: boolean;
  setShowAllAbilities: (showAllAbilities: boolean) => void;
  lastSharedAssetOrder: number;
  lastCharacterAssetOrder: number;
  doesUserOwnCharacter: boolean;
}

export function AssetSectionHeader(props: AssetsSectionHeaderProps) {
  const {
    campaignId,
    characterId,
    showAllAbilities,
    setShowAllAbilities,
    lastSharedAssetOrder,
    lastCharacterAssetOrder,
    doesUserOwnCharacter,
  } = props;
  const { t } = useTranslation();

  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);

  const handleAssetSelection = useCallback(
    (assetDocument: Omit<AssetDocument, "order">) => {
      setIsAssetDialogOpen(false);
      addAsset({
        characterId: assetDocument.shared ? undefined : characterId,
        campaignId: assetDocument.shared ? campaignId : undefined,
        asset: {
          ...assetDocument,
          order: assetDocument.shared
            ? lastSharedAssetOrder + 1
            : lastCharacterAssetOrder + 1,
        },
      });
    },
    [characterId, campaignId, lastCharacterAssetOrder, lastSharedAssetOrder],
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
