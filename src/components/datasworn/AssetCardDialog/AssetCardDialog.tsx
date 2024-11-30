import { Box, Dialog, DialogContent, Skeleton } from "@mui/material";
import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import { DialogTitleWithCloseButton } from "components/DialogTitleWithCloseButton";
import { GridLayout } from "components/Layout";

import { AssetDocument } from "api-calls/assets/_asset.type";

import {
  RootAssetCollections,
  useAssets,
} from "atoms/dataswornRules/useAssets";

import { AssetCollectionSidebar } from "./AssetCollectionSidebar";
import { AssetList } from "./AssetList";

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
  const [collection, setCollection] = useState(
    assetCollectionMap[selectedAssetCollectionId.collectionId],
  );
  const [isPending, startTransition] = useTransition();
  // const collection = assetCollectionMap[selectedAssetCollectionId.collectionId];

  useEffect(() => {
    const firstAssetCollection = getFirstAssetCollection(rootAssetCollections);
    setSelectedAssetCollectionId(firstAssetCollection);
    startTransition(() => {
      setCollection(assetCollectionMap[firstAssetCollection.collectionId]);
    });
  }, [rootAssetCollections, assetCollectionMap]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={"lg"} fullWidth>
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
            setSelectedCollectionId={(rulesetId, collectionId) => {
              setSelectedAssetCollectionId({ rulesetId, collectionId });
              startTransition(() => {
                setCollection(assetCollectionMap[collectionId]);
              });
            }}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          {isPending ? (
            <GridLayout
              items={[1, 2, 3, 4, 5]}
              renderItem={() => <Skeleton variant="rectangular" height={500} />}
              emptyStateMessage={""}
              minWidth={300}
            />
          ) : (
            <>
              {collection && (
                <AssetList
                  assetCollection={collection}
                  assetMap={assetMap}
                  selectAsset={handleAssetSelection}
                />
              )}
            </>
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
