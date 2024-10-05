import { Box, Dialog, DialogContent } from "@mui/material";
import { AssetDocument } from "api-calls/assets/_asset.type";
import { DialogTitleWithCloseButton } from "components/DialogTitleWithCloseButton";
import {
  AssetCollectionMap,
  useAssetCollections,
} from "atoms/dataswornRules/useAssetCollections";
import { useTranslation } from "react-i18next";
import { AssetCollectionSidebar } from "./AssetCollectionSidebar";
import { useEffect, useState } from "react";
import { AssetList } from "./AssetList";

export interface AssetCardDialogProps {
  open: boolean;
  handleClose: () => void;
  handleAssetSelection: (asset: Omit<AssetDocument, "order">) => void;
}
export function AssetCardDialog(props: AssetCardDialogProps) {
  const { open, handleClose, handleAssetSelection } = props;

  const { t } = useTranslation();

  const assetCollections = useAssetCollections();
  const [selectedAssetCollectionId, setSelectedAssetCollectionId] = useState(
    getFirstAssetCollection(assetCollections)
  );
  const collection =
    assetCollections[selectedAssetCollectionId.rulesetId]?.collections[
      selectedAssetCollectionId.collectionId
    ];

  useEffect(() => {
    setSelectedAssetCollectionId(getFirstAssetCollection(assetCollections));
  }, [assetCollections]);

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
            collections={assetCollections}
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
              selectAsset={handleAssetSelection}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function getFirstAssetCollection(assetCollections: AssetCollectionMap) {
  const firstRuleset = Object.keys(assetCollections)[0];

  if (!firstRuleset)
    return {
      rulesetId: "",
      collectionId: "",
    };

  const firstCollection = Object.values(
    assetCollections[firstRuleset].collections
  )[0];

  if (!firstCollection)
    return {
      rulesetId: "",
      collectionId: "",
    };

  return {
    rulesetId: firstRuleset,
    collectionId: firstCollection._id,
  };
}
