import { Datasworn } from "@datasworn/core";
import { Box, Button } from "@mui/material";
import { GridLayout } from "components/Layout";
import { MarkdownRenderer } from "components/MarkdownRenderer";
import { useTranslation } from "react-i18next";
import { AssetCard } from "../AssetCard/AssetCard";
import { AssetDocument } from "api-calls/assets/_asset.type";

export interface AssetListProps {
  assetCollection: Datasworn.AssetCollection;
  selectAsset: (asset: Omit<AssetDocument, "order">) => void;
}

export function AssetList(props: AssetListProps) {
  const { assetCollection, selectAsset } = props;

  const { t } = useTranslation();

  return (
    <Box>
      {assetCollection.name}
      {assetCollection.description && (
        <MarkdownRenderer markdown={assetCollection.description} />
      )}
      <GridLayout
        items={Object.values(assetCollection.contents)}
        renderItem={(asset) => (
          <AssetCard
            assetId={asset._id}
            actions={
              <Button
                color={"inherit"}
                variant="outlined"
                onClick={() => {
                  selectAsset({
                    id: asset._id,
                    enabledAbilities: {},
                  });
                }}
              >
                {t("Select Asset")}
              </Button>
            }
          />
        )}
        emptyStateMessage={t("No assets found in collection")}
        minWidth={300}
      />
    </Box>
  );
}
