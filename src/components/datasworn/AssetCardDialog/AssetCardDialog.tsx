import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Dialog, DialogContent } from "@mui/material";

import { AssetCollectionSidebar } from "./AssetCollectionSidebar";
import { AssetList } from "./AssetList";
import { AssetDocument } from "api-calls/assets/_asset.type";
import {
  RootAssetCollections,
  useAssets,
} from "atoms/dataswornRules/useAssets";
import { DialogTitleWithCloseButton } from "components/DialogTitleWithCloseButton";

export interface AssetCardDialogProps {
  open: boolean;
  handleClose: () => void;
  handleAssetSelection: (asset: Omit<AssetDocument, "order">) => void;
}
export function AssetCardDialog(props: AssetCardDialogProps) {
  const { open, handleClose, handleAssetSelection } = props;

  const { t } = useTranslation();

  const { rootAssetCollections, assetCollectionMap, assetMap } = useAssets();
  const [selectedAssetCollectionId, setSelectedAssetCollectionId] = useState(
    getFirstAssetCollection(rootAssetCollections),
  );
  const collection = assetCollectionMap[selectedAssetCollectionId.collectionId];

  useEffect(() => {
    setSelectedAssetCollectionId(getFirstAssetCollection(rootAssetCollections));
  }, [rootAssetCollections]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
      <DialogTitleWithCloseButton onClose={handleClose}>
        {t("datasworn.assets", "Assets")}
      </DialogTitleWithCloseButton>
      <DialogContent
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
        }}
        dividers
      >
        <Box sx={{ position: "sticky", top: 0, flexShrink: 0 }}>
          <AssetCollectionSidebar
            rootAssetCollections={rootAssetCollections}
            collectionMap={assetCollectionMap}
            selectedCollectionId={selectedAssetCollectionId.collectionId}
            setSelectedCollectionId={(rulesetId, collectionId) =>
              setSelectedAssetCollectionId({ rulesetId, collectionId })
            }
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          {collection && (
            <AssetList
              assetCollection={collection}
              assetMap={assetMap}
              selectAsset={handleAssetSelection}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function getFirstAssetCollection(assetCollections: RootAssetCollections) {
  const firstRuleset = Object.keys(assetCollections)[0];

  if (!firstRuleset)
    return {
      rulesetId: "",
      collectionId: "",
    };

  const firstCollection = assetCollections[firstRuleset].rootAssets[0];

  if (!firstCollection)
    return {
      rulesetId: "",
      collectionId: "",
    };

  return {
    rulesetId: firstRuleset,
    collectionId: firstCollection,
  };
}
