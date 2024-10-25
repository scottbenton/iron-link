import { useTranslation } from "react-i18next";
import { Box, Button, DialogActions, DialogContent } from "@mui/material";

import { AssetCard } from "../AssetCard";
import { Move } from "../Move";
import { Oracle } from "../Oracle";
import { OracleTableSharedText } from "../Oracle/OracleTableSharedText";
import { DataswornDialogTitle } from "./DataswornDialogTitle";
import { useGetDataswornItem } from "./useGetDataswornItem";
import { EmptyState } from "components/Layout/EmptyState";

export interface DataswornDialogContentProps {
  id: string;
  onClose: () => void;
}

export function DataswornDialogContent(props: DataswornDialogContentProps) {
  const { id, onClose } = props;
  const { t } = useTranslation();

  const item = useGetDataswornItem(id);

  if (item?.type === "oracle_rollable") {
    return (
      <>
        <DataswornDialogTitle>{item.oracle.name}</DataswornDialogTitle>
        <DialogContent>
          <Oracle oracleId={item.oracle._id} hideOracleName />
        </DialogContent>
      </>
    );
  }

  if (item?.type === "move") {
    return (
      <>
        <DataswornDialogTitle>{item.move.name}</DataswornDialogTitle>
        <DialogContent>
          <Move moveId={item.move._id} hideMoveName />
        </DialogContent>
      </>
    );
  }

  if (item?.type === "asset") {
    return (
      <>
        <DataswornDialogTitle>{item.asset.name}</DataswornDialogTitle>
        <DialogContent>
          <Box sx={{ maxWidth: 350, mx: "auto" }}>
            <AssetCard assetId={item.asset._id} />
          </Box>
        </DialogContent>
      </>
    );
  }

  if (
    item?.type === "oracle_collection" &&
    (item.oracleCollection.oracle_type === "table_shared_text" ||
      item.oracleCollection.oracle_type === "table_shared_text2" ||
      item.oracleCollection.oracle_type === "table_shared_text3")
  ) {
    return (
      <>
        <DataswornDialogTitle>
          {item.oracleCollection.name}
        </DataswornDialogTitle>
        <DialogContent>
          <OracleTableSharedText oracle={item.oracleCollection} />
        </DialogContent>
      </>
    );
  }
  return (
    <>
      <DataswornDialogTitle>
        {t("datasworn.dialog.not-found-title", "Could not find item")}
      </DataswornDialogTitle>
      <DialogContent>
        <EmptyState
          message={t(
            "datasworn.dialog.not-found-content",
            "The linked item with id {{itemId}} could not be found.",
            { itemId: id },
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          {t("common.close", "Close")}
        </Button>
      </DialogActions>
    </>
  );
}
