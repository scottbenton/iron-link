import { useTranslation } from "react-i18next";
import { Datasworn } from "@datasworn/core";
import { Box, Button } from "@mui/material";

import { AssetCard } from "../AssetCard/AssetCard";
import { AssetDocument } from "api-calls/assets/_asset.type";
import { AssetMap } from "atoms/dataswornRules/useAssets";
import { GridLayout } from "components/Layout";
import { MarkdownRenderer } from "components/MarkdownRenderer";

export interface AssetListProps {
  assetCollection: Datasworn.AssetCollection;
  selectAsset: (asset: Omit<AssetDocument, "order">) => void;
  assetMap: AssetMap;
}

export function AssetList(props: AssetListProps) {
  const { assetCollection, assetMap, selectAsset } = props;

  const { t } = useTranslation();

  return (
    <Box>
      {assetCollection.name}
      {assetCollection.description && (
        <MarkdownRenderer markdown={assetCollection.description} />
      )}
      <GridLayout
        items={Object.values(assetCollection.contents).map(
          (asset) => asset._id,
        )}
        renderItem={(assetId) => (
          <AssetCard
            assetId={assetId}
            actions={
              <Button
                color={"inherit"}
                variant="outlined"
                onClick={() => {
                  selectAsset({
                    id: assetId,
                    enabledAbilities: {},
                    shared: assetMap[assetId].shared,
                  });
                }}
              >
                {t("character.select-asset", "Select Asset")}
              </Button>
            }
          />
        )}
        emptyStateMessage={t(
          "datasworn.no-assets-in-collection",
          "No assets found in collection",
        )}
        minWidth={300}
      />
    </Box>
  );
}
